# ShareWallet Frontend

ShareWallet のフロントエンド（Next.js + Prisma + SQLite）です。  
他の人にコードを渡してもそのまま動かせるよう、セットアップ手順をまとめています。

## 前提環境

- Node.js: 20系（推奨: 20 LTS）
- npm: 10系以上
- OS: macOS / Linux / Windows（WSL可）

## セットアップ手順（初回）

```bash
git clone <このリポジトリURL>
cd sharewallet_frontend
npm install
```

### 環境変数

`.env` を作成してください（既にある場合はそのままでOK）。

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-change-in-production"
```

## DB 準備

このプロジェクトは Prisma + SQLite を使います。初回は以下を実行してください。

```bash
npx prisma db push
npx prisma generate
```

テストデータを入れたい場合:

```bash
npx prisma db seed
```

seed のログイン用パスワード: `password123`

## 開発サーバー起動

```bash
npm run dev
```

ブラウザで以下を開きます:

- http://localhost:3000

## よく使うコマンド

```bash
npm run dev      # 開発サーバー
npm run lint     # ESLint
npm run build    # 本番ビルド
```

## トラブルシュート

### 1) `better-sqlite3` の Node バージョン不一致エラー

`NODE_MODULE_VERSION` 系エラーが出た場合:

```bash
npm rebuild better-sqlite3
npx prisma generate
```

直らない場合:

```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### 2) `Next.js inferred your workspace root` 警告

複数 lockfile がある環境で出る警告です。  
基本的に開発動作には影響しません。

### 3) 画面反映が古い

- ブラウザでハードリロード（Mac: `Cmd + Shift + R`）
- それでも反映しない場合は `npm run dev` を再起動

## 引き継ぎメモ

- DB はローカル SQLite（`dev.db`）です
- API は `src/app/api` 配下の Route Handler です
- 主要型は `src/types/index.ts`
- API クライアントは `src/lib/apiClient.ts`
