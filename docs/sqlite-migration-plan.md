# SQLite 移管計画 — 思考プロセスと実装手順

## 1. 現状整理

### 現在のアーキテクチャ

```
[ブラウザ] → fetch → [Next.js API Route] → mockData.ts（決め打ち値）→ JSON レスポンス
```

- API ルートは `src/lib/mockData.ts` から直接値を読んでいる
- POST/PUT の結果は永続化されない（レスポンスは返すが保存しない）
- 認証はトークンの存在チェックのみ（JWT 検証なし）
- パスワードは検証していない（何でもログイン可能）

### モックデータのエンティティ関係

現在のモックデータを分析すると、以下の関係が浮かび上がる。

```
User ──┬── 1:N ── Expense
       │
       └── M:N ── Group（中間テーブル経由）
                    │
                    └── 1:N ── Expense
```
- **User ↔ Group**: 1人のユーザーが複数グループに所属、1グループに複数ユーザー（**多対多**）
- **Group ↔ Expense**: 1グループに複数の支出（**一対多**）
- **User ↔ Expense**: 1ユーザーが複数の支出を登録（**一対多**）

### 移行後のアーキテクチャ

```
[ブラウザ] → fetch → [Next.js API Route] → Prisma → SQLite（dev.db）→ JSON レスポンス
```

---

## 2. 技術選定の思考プロセス

### なぜ SQLite か

ShareWallet の特性を踏まえ、SQLite を DB として採用する。

| 特性 | SQLite の適合度 |
|---|---|
| ユーザー規模が限定的（シェアハウス・サークル単位） | ファイル DB で十分に高速 |
| 読み取り中心のワークロード（支出履歴の閲覧が多い） | SQLite の得意領域 |
| サーバー構成をシンプルに保ちたい | DB サーバー不要、ゼロコンフィグ |
| 開発環境のセットアップを簡単にしたい | ファイル1つで完結、Docker 不要 |
| バックアップが簡単であってほしい | `dev.db` をコピーするだけ |

### SQLite 固有の注意点

| 項目 | 対応 |
|---|---|
| 同時書き込みが単一ライター | WAL モード有効化で読み取り並行性を確保 |
| ENUM 型がない | `category` は `String` で保存、アプリ側の型で制約 |
| `ALTER TABLE` に制限がある | Prisma がマイグレーション時に自動でテーブル再作成して対処 |
| DB ファイルの永続化 | デプロイ先で永続ボリュームを確保する（後述） |

### ORM: Prisma を採用

SQLite と組み合わせる ORM として Prisma を選定する。

| 観点 | Prisma の強み |
|---|---|
| SQLite サポート | `datasource` に `provider = "sqlite"` を指定するだけ |
| 型安全 | スキーマから TypeScript の型を自動生成 |
| マイグレーション | `prisma migrate` で SQLite の制約（ALTER TABLE）を吸収 |
| 開発体験 | `prisma studio` で SQLite の中身を GUI で確認可能 |
| Next.js 親和性 | 公式ドキュメントで推奨されている組み合わせ |

### 認証の強化

| 要素 | 現状 | 移行後 |
|---|---|---|
| パスワード保存 | なし | bcrypt でハッシュ化して SQLite に保存 |
| トークン発行 | 固定文字列 | jose で JWT を生成（HS256） |
| トークン検証 | `startsWith("Bearer ")` | JWT をデコード・署名検証 + 有効期限 |
| ユーザー特定 | なし（常に MOCK_USER） | JWT payload の `sub` からユーザー ID を取得し DB 検索 |

### 追加パッケージ

| パッケージ | 種別 | 用途 |
|---|---|---|
| `prisma` | devDependency | Prisma CLI（マイグレーション・コード生成） |
| `@prisma/client` | dependency | Prisma Client（SQLite へのクエリ実行） |
| `bcryptjs` | dependency | パスワードハッシュ（pure JS、ネイティブ依存なし） |
| `jose` | dependency | JWT 生成・検証（Web Crypto API ベース） |
| `@types/bcryptjs` | devDependency | bcryptjs の型定義 |

> `bcrypt` ではなく `bcryptjs` を選ぶ理由: ネイティブバイナリ不要で CI / コンテナ環境でのトラブルが少ない。
> `jsonwebtoken` ではなく `jose` を選ぶ理由: Edge Runtime 対応、モダンな API。

---

## 3. DB スキーマ設計

### ER 図

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │  group_members   │       │    groups    │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id       PK  │──┐    │ id           PK  │    ┌──│ id       PK  │
│ name         │  ├───>│ user_id      FK  │    │  │ name         │
│ email    UQ  │  │    │ group_id     FK  │<───┘  │ color        │
│ password_hash│  │    │ created_at       │       │ created_at   │
│ color        │  │    └──────────────────┘       │ updated_at   │
│ avatar_url   │  │                                └──────┬───────┘
│ created_at   │  │                                       │
│ updated_at   │  │    ┌──────────────────┐               │
└──────────────┘  │    │    expenses      │               │
                  │    ├──────────────────┤               │
                  └───>│ member_id    FK  │               │
                       │ group_id     FK  │<──────────────┘
                       │ id           PK  │
                       │ category         │
                       │ amount           │
                       │ memo             │
                       │ date             │
                       │ created_at       │
                       └──────────────────┘
```

### Prisma スキーマ

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")  // "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String         @id @default(cuid())
  name         String
  email        String         @unique
  passwordHash String         @map("password_hash")
  color        String         @default("#c9a227")
  avatarUrl    String?        @map("avatar_url")
  createdAt    DateTime       @default(now()) @map("created_at")
  updatedAt    DateTime       @updatedAt @map("updated_at")

  groups       GroupMember[]
  expenses     Expense[]

  @@map("users")
}

model Group {
  id        String         @id @default(cuid())
  name      String
  color     String         @default("#c9a227")
  createdAt DateTime       @default(now()) @map("created_at")
  updatedAt DateTime       @updatedAt @map("updated_at")

  members   GroupMember[]
  expenses  Expense[]

  @@map("groups")
}

model GroupMember {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  groupId   String   @map("group_id")
  createdAt DateTime @default(now()) @map("created_at")

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([userId, groupId])
  @@map("group_members")
}

model Expense {
  id        String   @id @default(cuid())
  groupId   String   @map("group_id")
  memberId  String   @map("member_id")
  category  String                          // "食費" | "住居" | ... （SQLite に ENUM がないため String）
  amount    Int
  memo      String?
  date      DateTime
  createdAt DateTime @default(now()) @map("created_at")

  group  Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  member User  @relation(fields: [memberId], references: [id], onDelete: Cascade)

  @@map("expenses")
}
```

### 設計判断メモ

| 判断ポイント | 決定 | 理由 |
|---|---|---|
| ID 形式 | `cuid()` | UUID より短く、ソート可能。SQLite の TEXT 型で問題なし |
| `memberName` カラム | **持たない** | User テーブルの `name` を JOIN で取得。非正規化を避ける |
| `category` のカラム型 | `String` | SQLite に ENUM がないため文字列で保存。アプリ側の `CategoryName` 型で制約 |
| `avatarUrl` の保存 | SQLite に Data URL を保存 | SQLite は TEXT に上限がなく Data URL も問題なく格納可能 |
| `password_hash` | `bcryptjs` | salt 込みのハッシュ文字列を保存 |
| `amount` | `Int` | SQLite の INTEGER。小数が必要になった場合は「円 × 100」の整数管理も検討 |

---

## 4. 実装手順

### Phase 1: 環境構築 + スキーマ作成

```
所要時間目安: 30 分
```

#### Step 1-1: パッケージインストール

```bash
npm install @prisma/client bcryptjs jose
npm install -D prisma @types/bcryptjs
```

#### Step 1-2: Prisma 初期化（SQLite 指定）

```bash
npx prisma init --datasource-provider sqlite
```

生成されるファイル:
- `prisma/schema.prisma`（`provider = "sqlite"` が設定済み）
- `.env`（`DATABASE_URL="file:./dev.db"` が記載される）

#### Step 1-3: スキーマ定義

`prisma/schema.prisma` に上記のスキーマを記述する。

#### Step 1-4: マイグレーション実行

```bash
npx prisma migrate dev --name init
```

実行結果:
- `prisma/migrations/` にマイグレーション SQL が生成される
- `prisma/dev.db`（SQLite ファイル）が作成される
- `@prisma/client` が自動再生成される

#### Step 1-5: .gitignore に追加

```gitignore
# SQLite データベース
prisma/dev.db
prisma/dev.db-journal
prisma/dev.db-wal

# 環境変数
.env
```

> SQLite の WAL モード使用時に `dev.db-wal` ファイルが生成されるため、これも除外する。

---

### Phase 2: DB ユーティリティ + シードデータ

```
所要時間目安: 30 分
```

#### Step 2-1: Prisma Client シングルトン

Next.js の Hot Reload で SQLite への接続が増殖しないよう、シングルトンパターンで管理する。

作成: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

#### Step 2-2: シードスクリプト

作成: `prisma/seed.ts`

既存のモックデータ（`MOCK_USER`, `MOCK_GROUPS`, `MOCK_EXPENSES`）を SQLite に投入する。

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // テーブルを空にする（再実行対応）
  await prisma.expense.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("password123", 10);

  // 1. ユーザー作成
  const tanaka  = await prisma.user.create({
    data: { name: "田中 太郎", email: "tanaka@example.com",  passwordHash: hash, color: "#F59E0B" },
  });
  const suzuki  = await prisma.user.create({
    data: { name: "鈴木",     email: "suzuki@example.com",   passwordHash: hash, color: "#3B82F6" },
  });
  const sato    = await prisma.user.create({
    data: { name: "佐藤",     email: "sato@example.com",     passwordHash: hash, color: "#EC4899" },
  });
  const takahashi = await prisma.user.create({
    data: { name: "高橋",     email: "takahashi@example.com", passwordHash: hash, color: "#10B981" },
  });
  const yamada  = await prisma.user.create({
    data: { name: "山田",     email: "yamada@example.com",   passwordHash: hash, color: "#6366F1" },
  });
  const ito     = await prisma.user.create({
    data: { name: "伊藤",     email: "ito@example.com",      passwordHash: hash, color: "#F43F5E" },
  });

  // 2. グループ作成 + メンバー紐付け
  const group1 = await prisma.group.create({
    data: {
      name: "東京シェアハウス", color: "#c9a227",
      members: {
        create: [
          { userId: tanaka.id },
          { userId: suzuki.id },
          { userId: sato.id },
          { userId: takahashi.id },
        ],
      },
    },
  });

  await prisma.group.create({
    data: {
      name: "大学サークル会計", color: "#3B82F6",
      members: {
        create: [
          { userId: tanaka.id },
          { userId: yamada.id },
          { userId: ito.id },
        ],
      },
    },
  });

  await prisma.group.create({
    data: {
      name: "旅行（沖縄）", color: "#10B981",
      members: {
        create: [
          { userId: suzuki.id },
          { userId: sato.id },
        ],
      },
    },
  });

  // 3. 支出データ作成（東京シェアハウス）
  await prisma.expense.createMany({
    data: [
      { groupId: group1.id, memberId: tanaka.id,    category: "食費", amount: 3200,  memo: "スーパーで買い物",   date: new Date("2026-01-31T18:30:00") },
      { groupId: group1.id, memberId: suzuki.id,    category: "住居", amount: 12000, memo: "電気代 1月分",       date: new Date("2026-01-30T10:00:00") },
      { groupId: group1.id, memberId: sato.id,      category: "交通", amount: 1580,  memo: "タクシー代",         date: new Date("2026-01-29T22:15:00") },
      { groupId: group1.id, memberId: takahashi.id,  category: "娯楽", amount: 4500,  memo: "映画＋ポップコーン", date: new Date("2026-01-28T14:00:00") },
      { groupId: group1.id, memberId: tanaka.id,    category: "食費", amount: 8900,  memo: "みんなで外食",       date: new Date("2026-01-27T19:30:00") },
      { groupId: group1.id, memberId: suzuki.id,    category: "貯金", amount: 30000, memo: "共有貯金",           date: new Date("2026-01-25T09:00:00") },
      { groupId: group1.id, memberId: sato.id,      category: "住居", amount: 5400,  memo: "水道代 1月分",       date: new Date("2026-01-24T11:00:00") },
      { groupId: group1.id, memberId: takahashi.id,  category: "その他", amount: 2100, memo: "日用品",           date: new Date("2026-01-23T16:45:00") },
      { groupId: group1.id, memberId: tanaka.id,    category: "交通", amount: 520,   memo: "バス代",             date: new Date("2026-01-22T08:20:00") },
      { groupId: group1.id, memberId: sato.id,      category: "食費", amount: 1800,  memo: "コンビニ",           date: new Date("2026-01-21T12:30:00") },
    ],
  });

  console.log("Seed complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
```

`package.json` に追記:

```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

実行:

```bash
npx prisma db seed
```

> 全ユーザーの初期パスワードは `password123`。

---

### Phase 3: 認証ユーティリティ

```
所要時間目安: 20 分
```

#### Step 3-1: JWT ユーティリティ

作成: `src/lib/auth.ts`

```typescript
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);
const ALG = "HS256";

/** JWT トークン生成 */
export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

/** JWT トークン検証 → userId を返す。失敗時は null */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}

/** リクエストから認証ユーザー ID を取得 */
export async function getAuthUserId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return verifyToken(token);
}
```

#### Step 3-2: .env に JWT_SECRET を追加

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-random-secret-at-least-32-chars"
```

---

### Phase 4: API ルートの書き換え

```
所要時間目安: 1〜2 時間
```

各ルートで `mockData.ts` のインポートを削除し、Prisma 経由で SQLite にクエリする形に置き換える。
フロントエンド（`apiClient.ts` / 各ページ）は **変更不要**。

#### Step 4-1: POST /api/auth/login

```
Before: 常に MOCK_USER を返す
After:  email で SQLite 検索 → bcrypt.compare でパスワード照合 → JWT 生成
```

```typescript
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) { /* 400 */ }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    return NextResponse.json(
      { error: "メールアドレスまたはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  const token = await createToken(user.id);

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      color: user.color,
      avatarUrl: user.avatarUrl,
    },
  });
}
```

#### Step 4-2: POST /api/auth/register

```
Before: 常に成功を返す（保存しない）
After:  SQLite にユーザー INSERT（email 重複チェック）
```

```typescript
import bcrypt from "bcryptjs";

const passwordHash = await bcrypt.hash(body.password, 10);

const user = await prisma.user.create({
  data: {
    name: body.name,
    email: body.email,
    passwordHash,
  },
});
```

> SQLite の UNIQUE 制約により、email 重複時は Prisma が例外を投げる。try-catch で 409 を返す。

#### Step 4-3: GET /api/users/me

```
Before: MOCK_USER を返す
After:  JWT の sub から userId → SQLite 検索
```

```typescript
const userId = await getAuthUserId(req);
if (!userId) { /* 401 */ }

const user = await prisma.user.findUnique({
  where: { id: userId },
});
```

#### Step 4-4: PUT /api/users/me

```
Before: リクエストボディをそのまま返す
After:  SQLite を UPDATE して返す
```

```typescript
const updated = await prisma.user.update({
  where: { id: userId },
  data: {
    name: body.name,
    email: body.email,
    color: body.color,
    avatarUrl: body.avatarUrl,
  },
});
```

#### Step 4-5: GET /api/groups

```
Before: MOCK_GROUPS を返す
After:  ログインユーザーが所属するグループを SQLite から取得（members を JOIN）
```

```typescript
const groups = await prisma.group.findMany({
  where: {
    members: { some: { userId } },
  },
  include: {
    members: {
      include: { user: { select: { id: true, name: true, color: true } } },
    },
  },
});

// レスポンス形状を既存の Group 型に合わせて整形
const result = groups.map((g) => ({
  id: g.id,
  name: g.name,
  color: g.color,
  members: g.members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    color: m.user.color,
  })),
}));
```

> Prisma が生成する SQL では SQLite の JOIN を使って1回のクエリで取得する。

#### Step 4-6: GET /api/groups/:groupId

```
Before: MOCK_GROUPS.find() で検索
After:  SQLite から単一グループを取得（members を JOIN）
```

#### Step 4-7: GET /api/groups/:groupId/expenses

```
Before: MOCK_EXPENSES を返す
After:  グループに紐づく支出を SQLite から取得（member の name を JOIN）
```

```typescript
const expenses = await prisma.expense.findMany({
  where: { groupId },
  include: { member: { select: { id: true, name: true } } },
  orderBy: { date: "desc" },
});

const result = expenses.map((e) => ({
  id: e.id,
  category: e.category,
  amount: e.amount,
  memberId: e.member.id,
  memberName: e.member.name,
  memo: e.memo,
  date: e.date.toISOString(),
}));
```

#### Step 4-8: POST /api/groups/:groupId/expenses

```
Before: モックレコードを作って返す（保存しない）
After:  SQLite に INSERT して返す
```

```typescript
const expense = await prisma.expense.create({
  data: {
    groupId,
    memberId: userId,  // JWT から取得したログインユーザー
    category: body.category,
    amount: body.amount,
    memo: body.memo ?? null,
    date: new Date(),
  },
  include: { member: { select: { id: true, name: true } } },
});
```

---

### Phase 5: 整理・テスト

```
所要時間目安: 30 分
```

#### Step 5-1: 不要ファイルの削除

- `src/lib/mockData.ts` — 全 API ルートが SQLite に切り替わったら削除

#### Step 5-2: フロントエンド側の確認

フロントエンド（`apiClient.ts` / 各ページ）は **レスポンスの型が同じなので変更不要**。
ただし以下の一連フローを確認:

1. 新規登録（`/register`）→ ユーザーが SQLite に作成されるか
2. ログイン（`/login`）→ JWT が返却されるか
3. ダッシュボード（`/dashboard`）→ ユーザーの所属グループが表示されるか
4. 支出登録（`/expense`）→ SQLite に保存されるか
5. 支出履歴（`/expense/history`）→ 登録した支出が反映されるか
6. プロフィール更新（`/profile`）→ 更新が SQLite に反映されるか
7. ログアウト → 再ログインで正常にデータが取れるか

#### Step 5-3: Prisma Studio で SQLite の中身を確認

```bash
npx prisma studio
```

ブラウザ（`http://localhost:5555`）で SQLite の全テーブルを GUI 操作できる。
データの確認・編集・削除が可能。

---

## 5. ファイル変更一覧

### 新規作成

| ファイル | 内容 |
|---|---|
| `prisma/schema.prisma` | SQLite スキーマ定義 |
| `prisma/seed.ts` | シードデータ投入スクリプト |
| `.env` | `DATABASE_URL="file:./dev.db"`, `JWT_SECRET` |
| `src/lib/prisma.ts` | Prisma Client シングルトン（SQLite 接続管理） |
| `src/lib/auth.ts` | JWT 生成・検証ユーティリティ |

### 変更

| ファイル | 変更内容 |
|---|---|
| `package.json` | 依存追加 + prisma seed 設定 |
| `.gitignore` | `dev.db`, `dev.db-journal`, `dev.db-wal`, `.env` を追加 |
| `src/app/api/auth/login/route.ts` | SQLite 検索 + bcrypt + JWT |
| `src/app/api/auth/register/route.ts` | SQLite INSERT + bcrypt |
| `src/app/api/users/me/route.ts` | SQLite 検索 / 更新 |
| `src/app/api/groups/route.ts` | Prisma → SQLite クエリ |
| `src/app/api/groups/[groupId]/route.ts` | Prisma → SQLite クエリ |
| `src/app/api/groups/[groupId]/expenses/route.ts` | Prisma → SQLite クエリ |

### 削除

| ファイル | 理由 |
|---|---|
| `src/lib/mockData.ts` | SQLite に置き換え完了 |

### 変更不要

| ファイル | 理由 |
|---|---|
| `src/lib/apiClient.ts` | API のレスポンス型が変わらないため |
| `src/app/*/page.tsx`（全ページ） | API クライアント経由のため影響なし |
| `src/types/index.ts` | 型定義はそのまま使用 |
| `src/components/**` | コンポーネントは変更なし |

---

## 6. SQLite の運用メモ

### 開発環境

| 操作 | コマンド |
|---|---|
| マイグレーション適用 | `npx prisma migrate dev` |
| DB リセット（全データ削除 + 再シード） | `npx prisma migrate reset` |
| GUI でデータ確認 | `npx prisma studio` |
| スキーマ変更後のクライアント再生成 | `npx prisma generate` |
| SQLite ファイルを直接確認 | `sqlite3 prisma/dev.db` |

### バックアップ

SQLite はファイルベースなので、バックアップは単純なファイルコピーで完了する。

```bash
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db
```

### デプロイ時の考慮事項

SQLite はファイルベースのため、デプロイ先によって対応が異なる。

| デプロイ先 | SQLite の扱い |
|---|---|
| VPS / EC2 | サーバーのディスクにファイルを配置。最もシンプル |
| Docker | ボリュームマウントで永続化（`-v ./data:/app/prisma`） |
| Vercel | SQLite ファイルが揮発するため非推奨。Turso（分散 SQLite）を検討 |
| Fly.io | 永続ボリュームをアタッチ可能。SQLite と相性が良い |

---

## 7. 将来の拡張メモ

| トピック | 現状の方針 | 拡張案 |
|---|---|---|
| 分散 SQLite | ローカルファイル | Turso / LiteFS でリードレプリカ |
| 認証 | 自前 JWT | NextAuth.js / Clerk 等の認証サービス |
| パスワード | bcryptjs | Argon2（より安全だがネイティブ依存） |
| ファイル保存 | Data URL を SQLite に保存 | S3 / Cloudflare R2 にアップロード |
| バリデーション | 各ルートで手動チェック | Zod でスキーマバリデーション |
| テスト | なし | Vitest + テスト用 SQLite ファイル |

---

## 8. 作業順チェックリスト

```
Phase 1: 環境構築
  □ npm install (prisma, @prisma/client, bcryptjs, jose, @types/bcryptjs)
  □ npx prisma init --datasource-provider sqlite
  □ schema.prisma に SQLite スキーマを記述
  □ npx prisma migrate dev --name init
  □ .gitignore に dev.db, .env を追加

Phase 2: ユーティリティ + シード
  □ src/lib/prisma.ts 作成（シングルトン）
  □ prisma/seed.ts 作成（モックデータ → SQLite）
  □ package.json に prisma.seed 設定を追記
  □ npx prisma db seed 実行
  □ npx prisma studio でデータ確認

Phase 3: 認証
  □ src/lib/auth.ts 作成（JWT 生成・検証）
  □ .env に JWT_SECRET 追加

Phase 4: API ルート書き換え（mockData → SQLite）
  □ POST /api/auth/login
  □ POST /api/auth/register
  □ GET  /api/users/me
  □ PUT  /api/users/me
  □ GET  /api/groups
  □ GET  /api/groups/:groupId
  □ GET  /api/groups/:groupId/expenses
  □ POST /api/groups/:groupId/expenses

Phase 5: 整理
  □ src/lib/mockData.ts 削除
  □ ビルド確認 (npx next build)
  □ E2E フロー確認（登録→ログイン→支出登録→履歴→プロフィール）
```
