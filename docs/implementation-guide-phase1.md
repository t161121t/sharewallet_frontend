# 実装ガイド：Phase 1（ホーム・ログインまで）

モックアップに沿って「金貨アイコン → ハート型財布ロゴ → ホーム画面 → ログイン画面」の順で実装するための詳細手順です。

---

## 前提・既存コンポーネント

- **PrimaryButton**（`src/components/ui/PrimaryButton.tsx`）  
  金色グラデーション・`h-11`・`rounded-full`。そのまま利用可能。
- **TextInput**（`src/components/ui/TextInput.tsx`）  
  ラベル付き・灰背景・`h-11`・`rounded-lg`。そのまま利用可能。
- **ScreenContainer**（`src/components/layout/ScreenContainer.tsx`）  
  `360px` 幅・白背景・`min-h-[640px]`。各画面のラッパーとして使用。
- **Logo**（`src/components/ui/Logo.tsx`）  
  現状はプレースホルダー（「Logo」＋「ShareWallet」テキスト）。Step 2 でハート型財布に差し替え。

---

## Step 1：金貨アイコン（CoinIcon）

### 目的
複数画面のフッター中央に表示する「金貨」アイコンを共通コンポーネントとして用意する。

### 作成するファイル
- `src/components/ui/CoinIcon.tsx`

### 実装内容

1. **コンポーネント仕様**
   - 金貨を表す SVG をコンポーネント内に記述する（画像ファイルでも可）。
   - Props は任意で以下を検討：
     - `className?: string` … サイズや余白の上書き用。
     - `size?: 'sm' | 'md'` … デフォルトはフッター用の小さめ（例: 24px）。

2. **デザインの目安**
   - モックアップでは「小さな金貨アイコン」がフッター中央にある。
   - 色: 金色系（例: `#D4AF37` や Tailwind の `yellow-600` / `amber-600`）。
   - 円形＋中央に模様や数字がある金貨を想定したシンプルな SVG でよい。

3. **使用例（後続ステップで使う想定）**
   ```tsx
   <footer className="flex justify-center pt-8">
     <CoinIcon size="sm" />
   </footer>
   ```

4. **確認ポイント**
   - 他コンポーネントから `import CoinIcon from '@/components/ui/CoinIcon'` で読み込めること。
   - フッターに配置したときに中央に小さく表示されること。

---

## Step 2：ハート型財布ロゴ（HeartWalletLogo）

### 目的
ホーム・ログイン・新規登録で使う「ハート型の中に財布が2つ」のアイコンを用意し、既存の `Logo` と組み合わせられるようにする。

### 作成・修正するファイル
- **新規**: `src/components/ui/HeartWalletLogo.tsx` … ハート型財布アイコン単体。
- **修正**: `src/components/ui/Logo.tsx` … プレースホルダーをハート型財布＋「Share Wallet」テキストに変更。

### 実装内容

1. **HeartWalletLogo.tsx**
   - ハート形＋その中に財布が2つあるデザインを **SVG で描画**。
   - Props 例:
     - `className?: string`
     - `size?: number` または `width` / `height`（例: 112px = `h-28 w-28` に合わせる）。
   - 色: 金色系（PrimaryButton のグラデーションに近いトーンで統一）。
   - 現在の `Logo.tsx` では `h-28 w-28`（112px）のエリアがあるので、同じサイズで収まるようにする。

2. **Logo.tsx の変更**
   - いまの「Logo」プレースホルダー（`bg-gray-100` の四角）を **HeartWalletLogo** に差し替える。
   - その下のテキストは「Share Wallet」にし、モックアップ通り **スクリプト風・黒** で表示する（例: `font-serif` や Google Fonts のスクリプトフォント）。
   - レイアウトは `flex flex-col items-center gap-4` のままでもよい。

3. **確認ポイント**
   - ホーム・ログインで「ハート型財布 → Share Wallet テキスト」の並びになっていること。
   - 既存の `Logo` を import している箇所があれば、そのまま同じ使い方で表示が変わること。

---

## Step 3：ホーム画面（page.tsx）

### 目的
トップページ（`/`）をモックアップ通りの「ホーム」にする。ログイン・新規登録への導線を用意する。

### 修正するファイル
- `src/app/page.tsx`
- （必要なら）`src/app/layout.tsx` でフォントや背景色を調整。

### 実装内容

1. **レイアウト構成（上から順）**
   - **ScreenContainer** で全体をラップ。
   - その中に以下を縦に並べる（`flex flex-col items-center` と `gap` で調整）：
     1. **Logo**（Step 2 で更新済み = ハート型財布 ＋ 「Share Wallet」）
     2. **「ログイン」ボタン** … `PrimaryButton`。クリックで `/login` へ遷移（`Link` または `router.push`）。
     3. **「新規登録」ボタン** … `PrimaryButton`。クリックで `/register` へ遷移。
     4. **フッター** … `CoinIcon` を中央に配置。

2. **ルーティング**
   - 「ログイン」→ `Link href="/login"` または `<a href="/login">`。
   - 「新規登録」→ `/register` へのルートが必要。まだなければ `src/app/register/page.tsx` を後で作成する前提で、ここでは `Link href="/register"` を設置する。

3. **スタイルの目安**
   - ボタンは「縦に2つ・幅は親に合わせて full」で、モックアップに近い。
   - Logo とボタン群の間の余白（例: `gap-8` や `gap-10`）でバランスを取る。
   - フッターは画面下部に寄せるなら、`flex-1` で伸ばすか `mt-auto` を利用。

4. **削除するもの**
   - Next.js デフォルトの「Get started」「Deploy」「Learn」などのブロックはすべて削除する。

5. **確認ポイント**
   - `/` にアクセスすると、白いカード中央に「ハート型財布 ＋ Share Wallet ＋ ログイン ＋ 新規登録 ＋ 金貨」が表示されること。
   - ログイン・新規登録ボタンからそれぞれのパスに遷移できること。

---

## Step 4：ログイン画面の完成（login/page.tsx）

### 目的
`/login` をモックアップ通りの「ログイン」画面にする。入力2つ＋ログインボタン＋フッター。

### 修正するファイル
- `src/app/login/page.tsx`

### 実装内容

1. **レイアウト構成（上から順）**
   - **ScreenContainer** でラップ。
   - その中に以下を縦に並べる：
     1. **Logo**（ハート型財布 ＋ 「Share Wallet」）
     2. **入力フィールド1** … `TextInput`。ラベルは「ユーザー名」または「メールアドレス」、`type="text"`、`placeholder` で説明。
     3. **入力フィールド2** … `TextInput`。ラベルは「パスワード」、`type="password"`。
     4. **「ログイン」ボタン** … `PrimaryButton`。クリック時はまだ仮でよい（例: `alert` や後で API 呼び出しに差し替え）。
     5. **フッター** … `CoinIcon` を中央に配置。

2. **状態管理**
   - メール（またはユーザー名）とパスワードを `useState` で保持する。
   - 各 `TextInput` の `value` / `onChange` をその state に紐づける。

3. **ナビゲーション（任意）**
   - 「新規登録はこちら」などのリンクを `/register` に向けておくと親切。

4. **スタイルの目安**
   - 入力同士の間隔、ボタンとの間隔はホーム画面と揃える（例: `gap-4` や `gap-6`）。
   - 幅は `ScreenContainer` 内なので、`TextInput` は `w-full` のままでよい。

5. **確認ポイント**
   - `/login` で「Logo ＋ 2つの入力 ＋ ログインボタン ＋ 金貨」が表示されること。
   - 入力値を変更すると state が更新されること（コンソールや一時的な表示で確認可能）。

---

## 実装順序のまとめ

| 順番 | 内容 | 主な成果物 |
|------|------|------------|
| 1 | 金貨アイコン | `CoinIcon.tsx` |
| 2 | ハート型財布ロゴ | `HeartWalletLogo.tsx`、`Logo.tsx` の更新 |
| 3 | ホーム画面 | `page.tsx` の差し替え、`/login`・`/register` へのリンク |
| 4 | ログイン画面の完成 | `login/page.tsx` の実装（Logo・TextInput×2・PrimaryButton・CoinIcon） |

---

## 補足

- **新規登録ページ**（`/register`）は Phase 1 の「次」として、ログイン画面をコピーし入力3つ＋「新規登録」ボタンに変更すると効率的です。
- **フォント**：「Share Wallet」をスクリプト風にする場合は、`layout.tsx` で Google Fonts を読み込み、`Logo` に適用してください。
- **アクセシビリティ**：ボタンは `type="submit"` にするか `type="button"` のままにするかをフォームの有無で決め、アイコンには `aria-hidden="true"` や適切な `alt` を検討してください。

このガイドに沿って Step 1 から順に実装すると、モックアップに近いホーム・ログインまでを一通り揃えられます。
