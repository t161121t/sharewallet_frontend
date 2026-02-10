# HeartWalletLogo 実装手順

Step 2「ハート型財布ロゴ」の実装内容と手順をまとめます。

---

## 1. 目的

ホーム・ログイン・新規登録で使う「ハート型の中に財布が2つ」のアイコンを用意し、既存の `Logo` と組み合わせて「Share Wallet」のブランド表示にする。

---

## 2. 作成・修正するファイル

| 種別 | パス | 内容 |
|------|------|------|
| 新規 | `src/components/ui/HeartWalletLogo.tsx` | ハート型財布アイコン単体 |
| 修正 | `src/components/ui/Logo.tsx` | プレースホルダーを HeartWalletLogo ＋「Share Wallet」テキストに変更 |
| 修正 | `src/app/layout.tsx` | スクリプトフォント（Dancing Script）の読み込みと CSS 変数付与 |
| 修正 | `src/app/globals.css` | `@theme` に `--font-script` を追加（任意） |

---

## 3. 実装手順

### 3.1 HeartWalletLogo.tsx

#### Props の定義

- **size**（任意）: `number` … 表示サイズ（px）。デフォルトは `112`（Tailwind の `h-28 w-28` に合わせる）。
- **className**（任意）: サイズや余白を上書きしたいときに渡す。

#### SVG の構成

1. **ハートの輪郭**
   - 標準的なハートの path を使用（`d="M12 21.35l-1.45-1.32..."` など）。
   - 塗り: 金色の `linearGradient`（PrimaryButton に近いトーン）。
   - 縁: 細いストローク（例: `#B8860B`）で輪郭を強調。

2. **内側の財布×2**
   - ハート内の左側・右側に、簡略化した財布シルエットを配置。
   - 財布: 角丸の四角形＋上部にフタの線（横線）で表現。
   - 色: やや暗めの金色（例: `#8B6914`）で中身を、縁やフタは `#B8860B` / `#D4AF37` で表現。

#### 色の指定

- ハート: `#F7DC6F` → `#E8C547` → `#D4AF37` → `#B8860B` のグラデーション。
- 財布: 塗り `#8B6914`、ストローク `#B8860B`、フタの線 `#D4AF37`。

#### アクセシビリティ

- 装飾用のため `aria-hidden` を付与。

### 3.2 Logo.tsx の変更

1. **HeartWalletLogo の利用**
   - 「Logo」プレースホルダー（`bg-gray-100` の四角）を削除し、`<HeartWalletLogo size={112} />` に差し替える。

2. **テキスト**
   - 表記を「ShareWallet」→「Share Wallet」（スペース入り）に変更。
   - モックアップ通り **スクリプト風・黒** で表示する。
   - フォント: `layout.tsx` で読み込んだ Dancing Script を CSS 変数 `--font-dancing-script` で参照。`style={{ fontFamily: "var(--font-dancing-script)" }}` または Tailwind の `font-script`（`@theme` で定義した場合）を使用。

3. **レイアウト**
   - `flex flex-col items-center gap-4` のまま。アイコン → テキストの縦並びを維持。

### 3.3 スクリプトフォントの追加（layout.tsx / globals.css）

1. **layout.tsx**
   - `next/font/google` から `Dancing_Script` を import。
   - `Dancing_Script({ variable: "--font-dancing-script", subsets: ["latin"] })` でフォントを読み込み、`variable` を `body` の `className` に含める。これで `--font-dancing-script` が利用可能になる。

2. **globals.css**（任意）
   - `@theme inline` に `--font-script: var(--font-dancing-script);` を追加すると、Tailwind の `font-script` クラスで同じフォントを指定できる。

### 3.4 使用例

```tsx
// Logo コンポーネント経由（推奨：ハート型財布 ＋ 「Share Wallet」がセット）
import Logo from "@/components/ui/Logo";
<Logo />

// HeartWalletLogo 単体で使う場合
import HeartWalletLogo from "@/components/ui/HeartWalletLogo";
<HeartWalletLogo size={112} />
<HeartWalletLogo size={80} className="shrink-0" />
```

---

## 4. 確認ポイント

- [ ] `HeartWalletLogo` がハート形＋その中に財布2つで表示される。
- [ ] `Logo` を表示すると「ハート型財布 → Share Wallet テキスト」の並びになる。
- [ ] 「Share Wallet」がスクリプト風（Dancing Script）・黒で表示される。
- [ ] 既存で `Logo` を import している箇所は、そのまま同じ使い方で表示が変わること。

---

## 5. 実装済みの仕様（参考）

| 項目 | 内容 |
|------|------|
| HeartWalletLogo ファイル | `src/components/ui/HeartWalletLogo.tsx` |
| デフォルト size | 112px（`h-28 w-28` 相当） |
| viewBox | `0 0 24 24`（比率維持でスケール） |
| ハート | 1 path ＋ 金色グラデーション ＋ 縁ストローク |
| 財布 | 左右に各1つ、角丸四角＋フタの線 |
| Logo のテキスト | 「Share Wallet」、Dancing Script、黒 |
| フォント読み込み | `layout.tsx` で Dancing Script、`--font-dancing-script` |

後続の Step 3（ホーム画面）・Step 4（ログイン画面）では、`<Logo />` を画面上部に配置して利用する。
