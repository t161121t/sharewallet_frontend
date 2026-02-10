# Step 3：ホーム画面 実装手順

トップページ（`/`）をモックアップ通りの「ホーム」にするための実装内容と手順をまとめます。

---

## 1. 目的

- トップページを「ハート型財布 ＋ Share Wallet ＋ ログイン・新規登録ボタン ＋ 金貨フッター」のホーム画面にする。
- ログイン・新規登録への導線を用意する。

---

## 2. 作成・修正するファイル

| 種別 | パス | 内容 |
|------|------|------|
| 修正 | `src/app/page.tsx` | ホーム画面のレイアウトに差し替え |
| 修正 | `src/components/layout/ScreenContainer.tsx` | 内側の div に `flex flex-col` を追加（フッターを下部に寄せるため） |
| 新規 | `src/app/register/page.tsx` | 新規登録リンク先のプレースホルダーページ（後で Step 4 系で完成させる） |

---

## 3. 実装手順

### 3.1 レイアウト構成（上から順）

1. **ScreenContainer** で全体をラップする。
2. その中に **1本のラッパー div** を置き、`flex flex-col items-center w-full flex-1 min-h-0` を指定する。
   - `flex-1` で ScreenContainer 内の高さいっぱいを使い、`min-h-0` で flex の計算が正しく動くようにする。
3. ラッパー内の要素を **上から順** に並べる：
   - **Logo**（ハート型財布 ＋ 「Share Wallet」）
   - **ボタンエリア** … `flex flex-col gap-4 w-full mt-10` で、「ログイン」「新規登録」を縦に並べる。
   - **フッター** … `mt-auto pt-8 flex justify-center` で画面下部に寄せ、**CoinIcon** を中央に配置する。

### 3.2 ログイン・新規登録ボタン

- **見た目**: PrimaryButton と同じ金色グラデーション・`h-11`・`rounded-full`・`w-full` にする。
- **遷移**: Next.js の **Link** を使い、`href="/login"` と `href="/register"` でそれぞれの画面へ遷移させる。
- **アクセシビリティ**: `aria-label="ログイン画面へ"` など、リンクの目的が分かるラベルを付ける。
- **スタイル**: `Link` に PrimaryButton と同じ `className` を渡し、`flex items-center justify-center` で文字を中央寄せにする。ボタン風リンクとして扱う。

### 3.3 ルーティング

- 「ログイン」→ `Link href="/login"` … 既存の `src/app/login/page.tsx` へ遷移。
- 「新規登録」→ `Link href="/register"` … `src/app/register/page.tsx` を新規作成し、プレースホルダー（見出し＋金貨フッターなど）を置いておく。中身は Step 4 以降で実装する。

### 3.4 ScreenContainer の修正

- 内側の div（`w-[360px] min-h-[640px] ...`）に **`flex flex-col`** を追加する。
- これにより、子要素で `flex-1` と `mt-auto` が効き、フッターを画面下部に固定できる。

### 3.5 削除するもの

- Next.js デフォルトの「Get started」「Deploy」「Learn」「Go to nextjs.org」などのブロックはすべて削除する。
- `Image` や `ol` など、テンプレート用の import や要素も不要なものは削除する。

### 3.6 使用するコンポーネント・import

- `next/link` の **Link**
- **ScreenContainer**（`@/components/layout/ScreenContainer`）
- **Logo**（`@/components/ui/Logo`）
- **CoinIcon**（`@/components/ui/CoinIcon`）

---

## 4. 確認ポイント

- [ ] `/` にアクセスすると、白いカード中央に「ハート型財布 ＋ Share Wallet ＋ ログイン ＋ 新規登録 ＋ 金貨」が表示される。
- [ ] 「ログイン」をクリックすると `/login` に遷移する。
- [ ] 「新規登録」をクリックすると `/register` に遷移する（404 にならない）。
- [ ] フッターの金貨アイコンが画面下部に寄って表示される。
- [ ] ボタンは縦に2つ、幅は親に合わせて full で、見た目は PrimaryButton と揃っている。

---

## 5. 実装済みの仕様（参考）

| 項目 | 内容 |
|------|------|
| ホームのルート | `/`（`src/app/page.tsx`） |
| ログインのルート | `/login` |
| 新規登録のルート | `/register`（`src/app/register/page.tsx`・プレースホルダー） |
| レイアウト | ScreenContainer → ラッパー div（flex flex-col flex-1）→ Logo → ボタン2本 → フッター（CoinIcon） |
| ボタン | Link に PrimaryButton と同じ className を付与し、ボタン風リンクとして実装 |
| ScreenContainer | 内側の div に `flex flex-col` を追加済み |

次は Step 4（ログイン画面の完成）で、`/login` に Logo・入力2つ・ログインボタン・CoinIcon を配置する。
