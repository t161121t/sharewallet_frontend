# 09. コードレビュー: SQLite 移管実装

> 移管計画の詳細は `08-SQLite移管計画.md`、API 仕様は `07-API仕様書.md` を参照してください。

## 概要

モックデータ（`mockData.ts`）から SQLite（Prisma ORM v7）への移管を実施した。
全 API ルートが SQLite に対してクエリを発行するようになり、データの永続化と本物の JWT 認証が有効になった。

**ビルド結果:** 成功（エラーなし、既存の `<img>` 警告のみ）

---

## 新規作成ファイル

### `prisma/schema.prisma`

```
変更: SQLite スキーマ定義（4 テーブル: users, groups, group_members, expenses）
```

**良い点:**
- `@@map()` でテーブル名を snake_case に統一しており、SQL を直接叩く際にも読みやすい
- `@map()` でカラム名も snake_case にマッピングしている
- `onDelete: Cascade` で親レコード削除時の整合性を確保
- `@@unique([userId, groupId])` で group_members の重複登録を防止

**注意点:**
- `category` カラムは `String` 型。SQLite に ENUM がないため妥当だが、不正なカテゴリ名が INSERT される可能性がある。将来的には Zod 等でバリデーションを追加すべき

---

### `prisma.config.ts`

```
変更: Prisma CLI 設定（datasource URL, seed コマンド, マイグレーションパス）
```

**良い点:**
- Prisma v7 の推奨構成に従っている
- `dotenv/config` をインポートして `.env` からの環境変数読み込みを明示的に行っている

---

### `prisma/seed.ts`

```
変更: シードスクリプト（6ユーザー、3グループ、10支出レコード）
```

**良い点:**
- `deleteMany()` で全テーブルをクリアしてから INSERT するため、再実行しても安全
- 削除順序が FK 制約に配慮されている（expenses → groupMembers → groups → users）
- モックデータと同一の内容を投入しているため、移行前後で画面表示が変わらない

**注意点:**
- 全ユーザーの初期パスワードが `password123` で固定。開発用として妥当だが、本番では使わないこと
- `bcrypt.hash` のコストファクターは `10`。開発速度とセキュリティのバランスとして適切

---

### `src/lib/prisma.ts`

```
変更: Prisma Client シングルトン（ドライバーアダプター付き）
```

**良い点:**
- `globalThis` を使ったシングルトンパターンで、Next.js の Hot Reload 時にコネクションリークを防止
- Prisma v7 必須の `@prisma/adapter-better-sqlite3` ドライバーアダプターを使用

**レビューコメント:**
- `process.env.DATABASE_URL` のフォールバックに `"file:./dev.db"` を設定している。本番では必ず環境変数を設定すること

---

### `src/lib/auth.ts`

```
変更: JWT 生成・検証ユーティリティ
```

**良い点:**
- `jose` ライブラリを使用しており、Edge Runtime でも動作する
- HS256 + 7日間の有効期限は開発段階として適切
- `getAuthUserId()` がリクエストからユーザー ID を取得する便利なヘルパーになっている
- 検証失敗時は例外を投げずに `null` を返す安全な設計

**注意点:**
- `JWT_SECRET` のフォールバック値がハードコードされている。本番では必ず環境変数で上書きすること
- リフレッシュトークンの仕組みは未実装。長期運用する場合は検討が必要

---

## 変更ファイル

### `src/app/api/auth/login/route.ts`

```
Before: MOCK_USER を固定トークンと共に返却
After:  email で SQLite 検索 → bcrypt 照合 → JWT 生成
```

**良い点:**
- パスワード不一致時に「メールアドレスまたはパスワードが正しくありません」と曖昧なメッセージを返しており、セキュリティ上適切（どちらが間違っているかを明かさない）
- `avatarUrl: user.avatarUrl ?? undefined` で Prisma の `null` を TypeScript の `undefined` に変換している

---

### `src/app/api/auth/register/route.ts`

```
Before: 常に成功を返す（保存しない）
After:  SQLite にユーザー INSERT（email 重複チェック付き）
```

**良い点:**
- `findUnique` で事前に重複チェックしており、409 を返す
- `bcrypt.hash` のコストファクター 10 は適切

**改善案:**
- Prisma の `unique constraint violation` を try-catch で処理する方法もあるが、現在の明示的チェックの方が読みやすい

---

### `src/app/api/users/me/route.ts`

```
Before: MOCK_USER を返却 / リクエストボディをそのまま返却
After:  JWT からユーザー ID → SQLite 検索 / SQLite UPDATE
```

**良い点:**
- PUT では `body.xxx !== undefined` のチェックにより、送信されたフィールドのみ更新する部分更新に対応
- GET / PUT の両方で `getAuthUserId()` を使い認証を統一的に処理

---

### `src/app/api/groups/route.ts`

```
Before: MOCK_GROUPS を返却
After:  ログインユーザーが所属するグループを SQLite から取得
```

**良い点:**
- `members: { some: { userId } }` で、ログインユーザーが所属するグループのみをフィルタリング
- Prisma の `include` で members → user を JOIN し、1回のクエリで必要なデータを取得
- レスポンスを既存の `Group` 型に整形しているため、フロントエンドの変更が不要

---

### `src/app/api/groups/[groupId]/route.ts`

```
Before: MOCK_GROUPS.find() で検索
After:  SQLite から単一グループを取得
```

**良い点:**
- `findUnique` で ID 検索しており、404 ハンドリングも適切

---

### `src/app/api/groups/[groupId]/expenses/route.ts`

```
Before: MOCK_EXPENSES を返却 / モックレコードを作って返却
After:  SQLite から支出一覧取得 / SQLite に INSERT
```

**良い点:**
- GET: `orderBy: { date: "desc" }` で新しい支出から順に返却
- GET: `member` を JOIN して `memberName` を取得（非正規化を避けている）
- POST: `memberId: userId` で JWT のログインユーザーを自動的に登録者にしている
- POST: `date: new Date()` でサーバー側のタイムスタンプを使用（クライアント依存しない）

**注意点:**
- GET の `params` が `Promise<{ groupId: string }>` になっている。Next.js 15 の仕様に合わせた正しい対応
- POST ではグループメンバーかどうかの検証がない。将来的には「自分が所属するグループにのみ支出を登録できる」制約を追加すべき

---

## 削除ファイル

### `src/lib/mockData.ts`

全 API ルートが SQLite に移行完了したため削除。適切。

---

## フロントエンド（変更なし）

以下のファイルは**一切変更なし**。API のレスポンス型が維持されているため、フロントエンド側の修正が不要だった。これは前回の API 層導入時の設計が正しかったことを証明している。

- `src/lib/apiClient.ts`
- `src/types/index.ts`
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/expense/page.tsx`
- `src/app/expense/history/page.tsx`
- `src/app/profile/page.tsx`
- `src/components/**`

---

## 計画書との差分

実装中に計画書と異なる対応が必要だった箇所:

| 計画書の記述 | 実際の対応 | 理由 |
|---|---|---|
| `provider = "prisma-client-js"` | `provider = "prisma-client"` | Prisma v7 で旧プロバイダーは非推奨 |
| `import { PrismaClient } from "@prisma/client"` | `import { PrismaClient } from "@/generated/prisma/client"` | v7 ではカスタム出力パスからインポート |
| `new PrismaClient()` のみ | `new PrismaClient({ adapter })` | v7 ではドライバーアダプターが必須 |
| `package.json` にシード設定 | `prisma.config.ts` にシード設定 | v7 では `prisma.config.ts` が設定の中心 |
| `@prisma/adapter-better-sqlite3` は計画に含まれていない | 追加インストール | v7 の必須パッケージ |

---

## 総合評価

### 良い点
1. **フロントエンド変更ゼロ** — API レスポンス型を維持したため、バックエンドのみの変更で完結
2. **本物の認証** — JWT 発行・検証 + bcrypt パスワードハッシュが有効
3. **データ永続化** — 支出登録、プロフィール更新が実際に SQLite に保存される
4. **シードデータ** — 既存のモックデータと同等のデータを自動投入可能

### 今後の改善候補
1. **バリデーション** — Zod 導入でリクエストボディのスキーマ検証を強化
2. **グループメンバー検証** — 支出登録時に所属確認を追加
3. **リフレッシュトークン** — 長期運用向けにトークンのリフレッシュ機構を検討
4. **エラーハンドリング** — Prisma の例外（P2002 等）を統一的にハンドリング
5. **テスト** — Vitest + テスト用 SQLite ファイルでの API テスト
