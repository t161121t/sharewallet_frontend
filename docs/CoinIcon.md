# CoinIcon 実装手順

Step 1「金貨アイコン」の実装内容と手順をまとめます。

---

## 1. 目的

複数画面のフッター中央に表示する「金貨」アイコンを共通コンポーネントとして用意する。

---

## 2. 作成するファイル

- `src/components/ui/CoinIcon.tsx`

---

## 3. 実装手順

### 3.1 Props の定義

- **size**（任意）: `'sm' | 'md'`
  - `sm`: 24px（フッター用・デフォルト）
  - `md`: 32px（必要に応じて大きく表示）
- **className**（任意）: サイズや余白を上書きしたいときに渡す

### 3.2 SVG の構成

金貨を「円形＋立体感」で表現するため、次の3層にする。

1. **外側の円**
   - 金色のグラデーション（明→暗）で光沢を表現
   - 縁に細いストローク（例: `#B8860B`）でコインの輪郭を強調
2. **内側の円**
   - やや暗めのグラデーションで中央の凹み・立体感を表現
3. **中央の小円**
   - 単色（例: `#D4AF37`）で金貨の中心の模様として表示

### 3.3 色の指定

- モックアップに合わせて金色系を使用
- 例: `#D4AF37`（ゴールド）、`#B8860B`（ダークゴールド）、`#F7DC6F`（ライトゴールド）
- SVG 内で `linearGradient` を定義し、`fill="url(#id)"` で参照する

### 3.4 アクセシビリティ

- 装飾用アイコンのため `aria-hidden` を付与する
- 意味を持たせる場合は呼び出し側で `aria-label` などを付与する

### 3.5 使用例

```tsx
import CoinIcon from "@/components/ui/CoinIcon";

// フッター（デフォルト sm）
<footer className="flex justify-center pt-8">
  <CoinIcon size="sm" />
</footer>

// 大きめで表示
<CoinIcon size="md" />

// クラスで上書き
<CoinIcon size="sm" className="w-6 h-6" />
```

---

## 4. 確認ポイント

- [ ] `import CoinIcon from '@/components/ui/CoinIcon'` で読み込める
- [ ] フッターに配置したときに中央に小さく（24px）表示される
- [ ] `size="md"` で 32px になる
- [ ] `className` で見た目を上書きできる（必要に応じて）

---

## 5. 実装済みの仕様（参考）

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/ui/CoinIcon.tsx` |
| デフォルト size | `sm`（24px） |
| viewBox | `0 0 24 24`（サイズ変更時も比率維持） |
| グラデーション | 外側・内側の2種類を `defs` で定義 |
| アクセシビリティ | `aria-hidden` 付与 |

後続の Step 2〜4 では、各画面のフッターで `<CoinIcon size="sm" />` を配置して利用する。
