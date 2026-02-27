# 07. ShareWallet API 仕様書

## 概要

ShareWallet フロントエンドの Next.js Route Handlers で実装された API 一覧です。  
DB 設計の詳細は `08-SQLite移管計画.md`、コードレビューは `09-SQLiteコードレビュー.md` を参照してください。

**ベース URL:** `/api`

## 認証

ログイン API で取得したトークンを、以降のリクエストの `Authorization` ヘッダーに付与します。

```
Authorization: Bearer <token>
```

認証が必要なエンドポイントでトークンが無い、または不正な場合は `401` を返します。

```json
{
  "error": "認証が必要です"
}
```

---

## 型定義

### CategoryName

```typescript
type CategoryName = "貯金" | "住居" | "交通" | "食費" | "娯楽" | "その他";
```

### GroupMember

| フィールド | 型       | 説明                         |
| ---------- | -------- | ---------------------------- |
| `id`       | `string` | メンバー ID                  |
| `name`     | `string` | メンバー名                   |
| `color`    | `string` | アバターの色（HEX カラー値） |

### Group

| フィールド | 型              | 説明                           |
| ---------- | --------------- | ------------------------------ |
| `id`       | `string`        | グループ ID                    |
| `name`     | `string`        | グループ名                     |
| `members`  | `GroupMember[]`  | メンバー一覧                   |
| `color`    | `string`        | グループのテーマカラー（HEX）  |

### UserProfile

| フィールド  | 型                 | 説明                           |
| ----------- | ------------------ | ------------------------------ |
| `id`        | `string`           | ユーザー ID                    |
| `name`      | `string`           | ユーザー名                     |
| `email`     | `string`           | メールアドレス                 |
| `color`     | `string`           | アイコンの色（HEX）            |
| `avatarUrl` | `string?`          | アバター画像（Data URL、任意） |

### ExpenseRecord

| フィールド   | 型             | 説明                             |
| ------------ | -------------- | -------------------------------- |
| `id`         | `string`       | 支出 ID                          |
| `category`   | `CategoryName` | カテゴリ名                       |
| `amount`     | `number`       | 金額（円）                       |
| `memberId`   | `string`       | 登録したメンバーの ID            |
| `memberName` | `string`       | 登録したメンバーの名前           |
| `memo`       | `string?`      | メモ（任意）                     |
| `date`       | `string`       | 登録日時（ISO 8601 文字列）      |

---

## エンドポイント一覧

| メソッド | パス                                 | 認証 | 説明             |
| -------- | ------------------------------------ | ---- | ---------------- |
| POST     | `/api/auth/login`                    | 不要 | ログイン         |
| POST     | `/api/auth/register`                 | 不要 | 新規登録         |
| GET      | `/api/users/me`                      | 必要 | プロフィール取得 |
| PUT      | `/api/users/me`                      | 必要 | プロフィール更新 |
| GET      | `/api/groups`                        | 必要 | グループ一覧取得 |
| GET      | `/api/groups/:groupId`               | 必要 | グループ詳細取得 |
| GET      | `/api/groups/:groupId/expenses`      | 必要 | 支出一覧取得     |
| POST     | `/api/groups/:groupId/expenses`      | 必要 | 支出登録         |

---

## 各エンドポイント詳細

### POST `/api/auth/login`

ログイン処理を行い、トークンとユーザー情報を返却します。

**認証:** 不要

#### リクエストボディ

```json
{
  "email": "tanaka@example.com",
  "password": "password123"
}
```

| フィールド | 型       | 必須 | 説明             |
| ---------- | -------- | ---- | ---------------- |
| `email`    | `string` | ○    | メールアドレス   |
| `password` | `string` | ○    | パスワード       |

#### レスポンス

**成功 `200`**

```json
{
  "token": "mock-jwt-token-sharewallet-2026",
  "user": {
    "id": "u1",
    "name": "田中 太郎",
    "email": "tanaka@example.com",
    "color": "#F59E0B"
  }
}
```

**エラー `400`**

```json
{
  "error": "メールアドレスとパスワードを入力してください"
}
```

---

### POST `/api/auth/register`

新規ユーザー登録を行います。

**認証:** 不要

#### リクエストボディ

```json
{
  "name": "山田 花子",
  "email": "yamada@example.com",
  "password": "password123"
}
```

| フィールド | 型       | 必須 | 説明             |
| ---------- | -------- | ---- | ---------------- |
| `name`     | `string` | ○    | ユーザー名       |
| `email`    | `string` | ○    | メールアドレス   |
| `password` | `string` | ○    | パスワード       |

#### レスポンス

**成功 `200`**

```json
{
  "user": {
    "id": "u-1707580000000",
    "name": "山田 花子",
    "email": "yamada@example.com",
    "color": "#c9a227"
  }
}
```

**エラー `400`**

```json
{
  "error": "名前、メールアドレス、パスワードを入力してください"
}
```

---

### GET `/api/users/me`

認証済みユーザーのプロフィールを取得します。

**認証:** 必要

#### レスポンス

**成功 `200`**

```json
{
  "id": "u1",
  "name": "田中 太郎",
  "email": "tanaka@example.com",
  "color": "#F59E0B"
}
```

**エラー `401`**

```json
{
  "error": "認証が必要です"
}
```

---

### PUT `/api/users/me`

認証済みユーザーのプロフィールを更新します。

**認証:** 必要

#### リクエストボディ

```json
{
  "name": "田中 太郎（更新）",
  "email": "tanaka-new@example.com",
  "color": "#3B82F6",
  "avatarUrl": "data:image/jpeg;base64,..."
}
```

| フィールド  | 型        | 必須 | 説明                   |
| ----------- | --------- | ---- | ---------------------- |
| `name`      | `string`  | -    | ユーザー名             |
| `email`     | `string`  | -    | メールアドレス         |
| `color`     | `string`  | -    | アイコンの色           |
| `avatarUrl` | `string`  | -    | アバター画像 Data URL  |

※ 送信したフィールドのみ更新されます。`id` は変更できません。

#### レスポンス

**成功 `200`**

```json
{
  "id": "u1",
  "name": "田中 太郎（更新）",
  "email": "tanaka-new@example.com",
  "color": "#3B82F6",
  "avatarUrl": "data:image/jpeg;base64,..."
}
```

**エラー `400`**

```json
{
  "error": "リクエストボディが不正です"
}
```

---

### GET `/api/groups`

認証済みユーザーが所属するグループの一覧を取得します。

**認証:** 必要

#### レスポンス

**成功 `200`**

```json
[
  {
    "id": "grp-001",
    "name": "東京シェアハウス",
    "color": "#c9a227",
    "members": [
      { "id": "u1", "name": "田中", "color": "#F59E0B" },
      { "id": "u2", "name": "鈴木", "color": "#3B82F6" },
      { "id": "u3", "name": "佐藤", "color": "#EC4899" },
      { "id": "u4", "name": "高橋", "color": "#10B981" }
    ]
  },
  {
    "id": "grp-002",
    "name": "大学サークル会計",
    "color": "#3B82F6",
    "members": [
      { "id": "u1", "name": "田中", "color": "#F59E0B" },
      { "id": "u5", "name": "山田", "color": "#6366F1" },
      { "id": "u6", "name": "伊藤", "color": "#F43F5E" }
    ]
  }
]
```

---

### GET `/api/groups/:groupId`

指定したグループの詳細情報を取得します。

**認証:** 必要

#### パスパラメータ

| パラメータ | 型       | 説明        |
| ---------- | -------- | ----------- |
| `groupId`  | `string` | グループ ID |

#### レスポンス

**成功 `200`**

```json
{
  "id": "grp-001",
  "name": "東京シェアハウス",
  "color": "#c9a227",
  "members": [
    { "id": "u1", "name": "田中", "color": "#F59E0B" },
    { "id": "u2", "name": "鈴木", "color": "#3B82F6" },
    { "id": "u3", "name": "佐藤", "color": "#EC4899" },
    { "id": "u4", "name": "高橋", "color": "#10B981" }
  ]
}
```

**エラー `404`**

```json
{
  "error": "グループが見つかりません"
}
```

---

### GET `/api/groups/:groupId/expenses`

指定したグループの支出一覧を取得します。

**認証:** 必要

#### パスパラメータ

| パラメータ | 型       | 説明        |
| ---------- | -------- | ----------- |
| `groupId`  | `string` | グループ ID |

#### レスポンス

**成功 `200`**

```json
[
  {
    "id": "e1",
    "category": "食費",
    "amount": 3200,
    "memberId": "u1",
    "memberName": "田中",
    "memo": "スーパーで買い物",
    "date": "2026-01-31T18:30:00"
  },
  {
    "id": "e2",
    "category": "住居",
    "amount": 12000,
    "memberId": "u2",
    "memberName": "鈴木",
    "memo": "電気代 1月分",
    "date": "2026-01-30T10:00:00"
  }
]
```

---

### POST `/api/groups/:groupId/expenses`

指定したグループに新しい支出を登録します。

**認証:** 必要

#### パスパラメータ

| パラメータ | 型       | 説明        |
| ---------- | -------- | ----------- |
| `groupId`  | `string` | グループ ID |

#### リクエストボディ

```json
{
  "category": "食費",
  "amount": 1500,
  "memberId": "u1",
  "memberName": "田中",
  "memo": "ランチ代"
}
```

| フィールド   | 型             | 必須 | 説明                           |
| ------------ | -------------- | ---- | ------------------------------ |
| `category`   | `CategoryName` | ○    | カテゴリ名                     |
| `amount`     | `number`       | ○    | 金額（円）                     |
| `memberId`   | `string`       | -    | メンバー ID（デフォルト: `u1`）|
| `memberName` | `string`       | -    | メンバー名（デフォルト: `田中`）|
| `memo`       | `string`       | -    | メモ                           |

#### レスポンス

**成功 `201`**

```json
{
  "id": "e-1707580000000",
  "category": "食費",
  "amount": 1500,
  "memberId": "u1",
  "memberName": "田中",
  "memo": "ランチ代",
  "date": "2026-02-10T12:00:00.000Z"
}
```

**エラー `400`**

```json
{
  "error": "カテゴリと金額は必須です"
}
```

---

## 共通エラーレスポンス

全エンドポイント共通で、エラー時は以下の形式で返却されます。

```json
{
  "error": "エラーメッセージ"
}
```

| ステータスコード | 説明                     |
| ---------------- | ------------------------ |
| `400`            | リクエスト不正           |
| `401`            | 認証エラー               |
| `404`            | リソースが見つからない   |

---

## 備考

- SQLite + Prisma v7 によるデータ永続化を実装済み（`08-SQLite移管計画.md` 参照）
- JWT 認証を導入済み（jose ライブラリ使用、bcryptjs でパスワードハッシュ化）
- ファイル配置: `src/app/api/` 配下（Next.js Route Handlers）
