# フロントエンドセットアップガイド

## 前提条件

1. **バックエンド (CDK) のデプロイが完了していること**
   ```bash
   # プロジェクトルートから
   pnpm cdk run deploy '*'
   ```

   デプロイ後、以下の値が出力されます：
   - `GraphQLAPIURL`: AppSync GraphQL エンドポイント
   - `GraphQLAPIKey`: API Key

## セットアップ手順

### 1. 環境変数の設定

```bash
cd pkgs/frontend
cp .env.local.example .env.local
```

`.env.local` を編集して、CDK デプロイ時の出力値を設定：

```env
NEXT_PUBLIC_APPSYNC_ENDPOINT=<GraphQLAPIURL の値>
NEXT_PUBLIC_APPSYNC_API_KEY=<GraphQLAPIKey の値>
NEXT_PUBLIC_AWS_REGION=ap-northeast-1
```

### 2. GraphQL 型定義の生成

```bash
pnpm codegen
```

このコマンドは、GraphQL スキーマから TypeScript の型定義を自動生成します。
生成されたファイルは `.gitignore` に含まれているため、**初回セットアップ時やスキーマ変更時には必ず実行してください**。

### 3. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 にアクセスします。

## 動作確認

1. ナンバープレート入力フィールドに `BR794ZQ3` を入力
2. 「検索」ボタンをクリック
3. 車両情報と不具合履歴が表示されることを確認

## よくある問題

### GraphQL型が見つからないエラー

```bash
pnpm codegen
```

を実行して型定義を生成してください。

### AppSync接続エラー

- `.env.local` の設定値が正しいか確認
- バックエンド (CDK) が正しくデプロイされているか確認
- API Keyが有効期限内か確認（デフォルト: 365日）

### ビルドエラー

```bash
# 古い生成ファイルをクリーン
pnpm codegen

# ビルドを再実行
pnpm build
```

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **GraphQL**: AWS Amplify
- **型安全性**: GraphQL Code Generator
- **言語**: TypeScript
