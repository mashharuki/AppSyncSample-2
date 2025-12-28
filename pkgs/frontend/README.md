# 車両検索フロントエンド

AWS AppSync + DynamoDB GraphQL APIを使用した車両検索システムのフロントエンドアプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **GraphQLクライアント**: AWS Amplify
- **型安全性**: TypeScript + GraphQL Code Generator
- **言語**: TypeScript

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成します：

```bash
cp .env.local.example .env.local
```

バックエンド (CDK) をデプロイした後、出力される値を `.env.local` に設定してください：

```env
NEXT_PUBLIC_APPSYNC_ENDPOINT=<CDKデプロイ後の GraphQLAPIURL>
NEXT_PUBLIC_APPSYNC_API_KEY=<CDKデプロイ後の GraphQLAPIKey>
NEXT_PUBLIC_AWS_REGION=ap-northeast-1
```

### 3. GraphQL型定義の生成

GraphQLスキーマから TypeScript の型定義を生成します：

```bash
pnpm codegen
```

**注意**: コード生成されたファイルは `.gitignore` に含まれているため、初回セットアップ時や GraphQL スキーマ変更時には必ず実行してください。

### 4. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

1. ナンバープレート入力フィールドにナンバープレートを入力 (例: `BR794ZQ3`)
2. 「検索」ボタンをクリック
3. 車両情報と不具合履歴が表示されます

## 開発

### GraphQLクエリの追加・変更

1. `lib/graphql/queries.ts` でクエリを定義
2. `pnpm codegen` で型を再生成
3. コンポーネントで型安全にクエリを使用

### コードフォーマット

```bash
pnpm format
```

### ビルド

```bash
pnpm build
```

## ディレクトリ構造

```
pkgs/frontend/
├── app/                    # Next.js App Router
│   ├── components/         # Reactコンポーネント
│   │   └── CarSearch.tsx   # 車両検索コンポーネント
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # ホームページ
├── lib/                    # ユーティリティとロジック
│   ├── amplify-config.ts   # AWS Amplify設定
│   ├── graphql-client.ts   # GraphQLクライアント初期化
│   └── graphql/            # GraphQL関連
│       └── queries.ts      # GraphQLクエリ定義
├── codegen.ts              # GraphQL Code Generator設定
└── .env.local.example      # 環境変数テンプレート
```

## トラブルシューティング

### GraphQL型が見つからない

`pnpm codegen` を実行して型定義を生成してください。

### AppSyncへの接続エラー

- `.env.local` の設定値が正しいか確認
- バックエンド (CDK) が正しくデプロイされているか確認
- API Keyが有効期限内か確認

### CORS エラー

AppSync側でCORS設定が必要な場合がありますが、API_KEY認証では通常問題ありません。

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
