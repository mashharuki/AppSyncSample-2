# AWS Amplify ホスティング設定ガイド

このドキュメントでは、フロントエンドアプリケーションをAWS Amplifyでホスティングする手順を説明します。

## 前提条件

- AWSアカウント
- GitHubリポジトリへのアクセス権限
- AppSync APIがデプロイ済み（CDKスタック）

## セットアップ手順

### 1. AWS Amplifyコンソールでアプリケーションを作成

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify/)にアクセス
2. 「新しいアプリ」→「ウェブアプリをホストする」を選択
3. GitHubを選択し、リポジトリを接続
4. このリポジトリ（`mashharuki/AppSyncSample-2`）を選択
5. デプロイするブランチを選択（例: `main`）

### 2. ビルド設定の確認

Amplifyは自動的にリポジトリルートの `amplify.yml` を検出します。設定内容:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm@10.20.0
        - pnpm install
    build:
      commands:
        - pnpm --filter frontend codegen
        - pnpm --filter frontend build
  artifacts:
    baseDirectory: pkgs/frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - ~/.pnpm-store/**/*
      - pkgs/frontend/.next/cache/**/*
```

### 3. 環境変数の設定

Amplifyコンソールで以下の環境変数を設定してください:

| 環境変数名 | 説明 | 例 |
|-----------|------|-----|
| `NEXT_PUBLIC_APPSYNC_ENDPOINT` | AppSync GraphQL APIのエンドポイント | `https://xxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql` |
| `NEXT_PUBLIC_APPSYNC_API_KEY` | AppSync APIキー | CDKデプロイ後の出力から取得 |
| `NEXT_PUBLIC_AWS_REGION` | AWSリージョン | `ap-northeast-1` |

#### 環境変数の設定方法

1. Amplifyコンソールでアプリを選択
2. 左メニューから「アプリの設定」→「環境変数」を選択
3. 「変数を追加」をクリック
4. 上記の環境変数を追加

### 4. ビルドとデプロイ

設定完了後、Amplifyが自動的にビルドとデプロイを開始します。

ビルドプロセス:
1. 依存関係のインストール（pnpm）
2. GraphQL型定義の生成
3. Next.jsアプリケーションのビルド
4. ホスティング環境へのデプロイ

### 5. カスタムドメインの設定（オプション）

1. Amplifyコンソールで「ドメイン管理」を選択
2. カスタムドメインを追加
3. DNSレコードを設定（Route 53またはその他のDNSプロバイダー）

## トラブルシューティング

### ビルドが失敗する場合

#### pnpmのバージョンエラー
- `amplify.yml`でpnpmのバージョンが正しく指定されているか確認
- 現在の設定: `pnpm@10.20.0`

#### GraphQL Code Generationのエラー
- AppSync APIが正しくデプロイされているか確認
- 環境変数が正しく設定されているか確認
- `pkgs/frontend/codegen.ts`の設定を確認

#### Next.jsビルドエラー
- 環境変数が全て設定されているか確認
- `pkgs/frontend/package.json`の依存関係を確認

### 環境変数が反映されない場合

1. Amplifyコンソールで環境変数を確認
2. 再デプロイを実行
3. ビルドログで環境変数が読み込まれているか確認

### キャッシュの問題

ビルドキャッシュが原因で問題が発生する場合:
1. Amplifyコンソールでアプリを選択
2. 「ビルド設定」→「ビルドイメージ設定」
3. 「キャッシュをクリア」を実行
4. 再デプロイ

## Next.js特有の設定

### 出力モード

現在の設定では、Next.jsのデフォルトサーバーモードを使用しています。

静的エクスポート（Static Export）を使用する場合:
1. `pkgs/frontend/next.config.ts`に`output: 'export'`を追加
2. `amplify.yml`の`baseDirectory`を`pkgs/frontend/out`に変更

### 環境変数のプレフィックス

Next.jsでは、ブラウザで利用する環境変数は`NEXT_PUBLIC_`プレフィックスが必要です。
サーバー側のみで使用する環境変数はプレフィックスなしで設定できます。

## パフォーマンス最適化

### キャッシュの活用

`amplify.yml`では以下をキャッシュしています:
- pnpmストア（依存関係）
- Next.jsビルドキャッシュ
- node_modules

### ビルド時間の短縮

- 不要な依存関係の削除
- `codegen`ステップの最適化
- キャッシュの適切な設定

## セキュリティ

### APIキーの管理

- APIキーは環境変数として設定し、コードにハードコードしない
- 必要に応じてAPIキーのローテーションを実施
- 本番環境とステージング環境で異なるAPIキーを使用

### CORS設定

AppSync側でCORS設定が必要な場合があります。CDKスタックで適切に設定されているか確認してください。

## モニタリング

Amplifyコンソールで以下を確認できます:
- ビルド履歴とログ
- デプロイ状況
- アクセスメトリクス
- エラーログ

## 参考リンク

- [AWS Amplify Hosting Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [AWS AppSync](https://aws.amazon.com/jp/appsync/)
