# Step 4：ログイン画面 実装手順

`/login` をモックアップ通りの「ログイン」画面にするための実装内容と手順をまとめます。

---

## 1. 目的

- `/login` を「ハート型財布 ＋ Share Wallet ＋ 入力2つ ＋ ログインボタン ＋ 金貨フッター」のログイン画面にする。
- メールアドレス（またはユーザー名）とパスワードを入力し、ログインボタンで送信できるようにする（送信処理は仮実装でよい）。
- 新規登録へのリンクを用意する。

---

## 2. 作成・修正するファイル

| 種別 | パス | 内容 |
|------|------|------|
| 修正 | `src/app/login/page.tsx` | ログイン画面のレイアウト・入力・ボタン・フッターを実装 |

---

## 3. 実装手順

### 3.1 クライアントコンポーネントにする

- `useState` を使うため、ファイル先頭に **`"use client"`** を付ける。
- Next.js の App Router では、state を持つページはクライアントコンポーネントとして扱う。

### 3.2 レイアウト構成（上から順）

1. **ScreenContainer** で全体をラップする。
2. その中に **1本のラッパー div** を置き、`flex flex-col items-center w-full flex-1 min-h-0` を指定する（Step 3 のホーム画面と同じ）。
3. ラッパー内の要素を **上から順** に並べる：
   - **Logo**（ハート型財布 ＋ 「Share Wallet」）
   - **入力・ボタンエリア** … `flex flex-col gap-4 w-full mt-10` で、入力2つ・ログインボタン・「新規登録はこちら」リンクを縦に並べる。
   - **フッター** … `mt-auto pt-8 flex justify-center` で画面下部に寄せ、**CoinIcon** を中央に配置する。

### 3.3 状態管理

- **メールアドレス** 用の state: `useState("")` で保持し、変数名は `email` などとする。
- **パスワード** 用の state: `useState("")` で保持し、変数名は `password` などとする。
- 各 **TextInput** の `value` に該当する state、`onChange` に state の setter（例: `setEmail`）を渡す。

### 3.4 入力フィールド

1. **1つ目（メールアドレス）**
   - **TextInput** を使用。
   - `label="メールアドレス"`、`type="text"`、`placeholder="example@example.com"` など。
   - `value={email}`、`onChange={setEmail}` で state に紐づける。

2. **2つ目（パスワード）**
   - **TextInput** を使用。
   - `label="パスワード"`、`type="password"`、`placeholder="パスワードを入力"` など。
   - `value={password}`、`onChange={setPassword}` で state に紐づける。

### 3.5 ログインボタン

- **PrimaryButton** を使用し、子要素は「ログイン」とする。
- **onClick**: 仮実装でよい。例: `console.log({ email, password })` や `alert("ログイン（仮）")`。後で API 呼び出しに差し替える。
- 関数名は `handleLogin` などにし、`onClick={handleLogin}` で渡す。

### 3.6 新規登録へのリンク（任意）

- ログインボタンの下に「新規登録はこちら」などのテキストを置く。
- **Link**（`next/link`）で `href="/register"` を指定する。
- スタイル: `text-sm text-gray-600`、`underline hover:text-gray-800` など。`aria-label="新規登録画面へ"` を付けると親切。

### 3.7 使用するコンポーネント・import

- `"use client"`
- `useState`（`react`）
- **Link**（`next/link`）
- **ScreenContainer**（`@/components/layout/ScreenContainer`）
- **Logo**（`@/components/ui/Logo`）
- **TextInput**（`@/components/ui/TextInput`）
- **PrimaryButton**（`@/components/ui/PrimaryButton`）
- **CoinIcon**（`@/components/ui/CoinIcon`）

---

## 4. 確認ポイント

- [ ] `/login` にアクセスすると、「Logo ＋ メールアドレス入力 ＋ パスワード入力 ＋ ログインボタン ＋ 新規登録はこちら ＋ 金貨」が表示される。
- [ ] メールアドレス欄に入力すると state が更新され、表示が変わる（またはコンソールで確認できる）。
- [ ] パスワード欄に入力すると state が更新される。入力はマスク表示（`type="password"`）になっている。
- [ ] ログインボタンをクリックすると、仮実装の処理（例: `console.log`）が実行される。
- [ ] 「新規登録はこちら」をクリックすると `/register` に遷移する。
- [ ] フッターの金貨アイコンが画面下部に寄って表示される。

---

## 5. 実装済みの仕様（参考）

| 項目 | 内容 |
|------|------|
| ルート | `/login`（`src/app/login/page.tsx`） |
| クライアント | `"use client"` 付与 |
| 状態 | `email`、`password`（ともに `useState`） |
| レイアウト | ScreenContainer → ラッパー div → Logo → 入力2つ・ログインボタン・新規登録リンク → フッター（CoinIcon） |
| 入力1 | TextInput（メールアドレス、`type="text"`） |
| 入力2 | TextInput（パスワード、`type="password"`） |
| ログインボタン | PrimaryButton、onClick は仮実装（`console.log`） |
| 新規登録 | Link to `/register`、「新規登録はこちら」 |

Phase 1 の「ホーム・ログインまで」はここで一通り揃う。次は新規登録画面（`/register`）をログイン画面をベースに入力3つ＋「新規登録」ボタンで完成させるなど、Phase 1 の拡張や Phase 2 に進める。
