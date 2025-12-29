# AWS Amplify Hosting - CDKによるセットアップガイド

このガイドでは、AWS CDKを使用してフロントエンドアプリケーションをAWS Amplifyにデプロイする方法を説明します。

## 📋 前提条件

- AWS CLIがインストールされ、設定されていること
- AWS CDKがインストールされていること (`npm install -g aws-cdk`)
- GitHubの個人アクセストークン（Personal Access Token）を持っていること
- 適切なAWS権限を持つIAMユーザー/ロールでログインしていること

## 🔑 ステップ1: GitHubトークンの準備

### GitHubトークンの作成

1. GitHubの設定ページにアクセス: https://github.com/settings/tokens
2. "Generate new token (classic)" をクリック
3. 以下のスコープを選択:
   - `repo` (リポジトリへのフルアクセス)
   - `admin:repo_hook` (リポジトリフックの管理)
4. トークンを生成してコピー（**後で使用するため保存しておく**）

### AWS Secrets Managerにトークンを保存

```bash
# GitHubトークンをSecrets Managerに保存
aws secretsmanager create-secret \
  --name github-token \
  --description "GitHub Personal Access Token for Amplify" \
  --secret-string "ghp_your_github_token_here" \
  --region ap-northeast-1
```

**注意**: すでにシークレットが存在する場合は、以下のコマンドで更新できます:

```bash
aws secretsmanager update-secret \
  --secret-id github-token \
  --secret-string "ghp_your_github_token_here" \
  --region ap-northeast-1
```

## 📦 ステップ2: 依存関係のインストール

プロジェクトのルートディレクトリから:

```bash
# pnpmで依存関係をインストール
pnpm install

# CDKパッケージのディレクトリに移動
cd pkgs/cdk

# CDKの依存関係を再インストール（新しいAmplify constructを含む）
pnpm install
```

## 🏗️ ステップ3: CDKスタックのデプロイ

### CDKブートストラップ（初回のみ）

もしAWSアカウントとリージョンで初めてCDKを使用する場合、ブートストラップが必要です:

```bash
cdk bootstrap aws://ACCOUNT-ID/REGION
# 例: cdk bootstrap aws://123456789012/ap-northeast-1
```

### スタックのデプロイ

```bash
# CDKパッケージのディレクトリから
pnpm run deploy

# または直接CDKコマンドを実行
cdk deploy
```

デプロイ中、CDKは変更内容を表示し、確認を求めます。`y`を入力して続行します。

### デプロイの確認

デプロイが成功すると、以下の出力が表示されます:

```
Outputs:
CdkAppsyncDemoStack.GraphQLAPIURL = https://xxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql
CdkAppsyncDemoStack.GraphQLAPIKey = da2-xxxxxxxxxxxxxxxxxxxxx
CdkAppsyncDemoStack.AmplifyAppId = d1234567890abc
CdkAppsyncDemoStack.AmplifyAppURL = https://main.d1234567890abc.amplifyapp.com
CdkAppsyncDemoStack.CarsTableName = cardata-cars
CdkAppsyncDemoStack.DefectsTableName = cardata-defects
```

## 🚀 ステップ4: デプロイの確認

### AWS Amplify コンソールで確認

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify/)にアクセス
2. "appsync-sample-frontend"アプリを選択
3. デプロイの進行状況を確認

### ビルドの監視

Amplifyは以下のステージでビルドを実行します:

1. **Provision** - ビルド環境のセットアップ
2. **Build** - アプリケーションのビルド
   - pnpmのインストール
   - 依存関係のインストール
   - GraphQL Code Generation
   - Next.jsビルド
3. **Deploy** - 静的アセットのデプロイ
4. **Verify** - デプロイの検証

### アプリケーションへのアクセス

ビルドが完了したら、出力されたURLにアクセスしてアプリケーションを確認できます:

```
https://main.d1234567890abc.amplifyapp.com
```

## ⚙️ CDKスタックの構成

### 環境変数

CDKスタックは以下の環境変数を自動的にフロントエンドに渡します:

- `NEXT_PUBLIC_APPSYNC_ENDPOINT` - AppSync GraphQL APIエンドポイント
- `NEXT_PUBLIC_APPSYNC_API_KEY` - APIキー
- `NEXT_PUBLIC_AWS_REGION` - AWSリージョン

これらは`api.graphqlUrl`と`api.apiKey`から自動的に取得されます。

### ビルド設定

ビルド設定はCDKスタック内で定義されています:

```typescript
buildSpec: cdk.aws_codebuild.BuildSpec.fromObjectToYaml({
  version: 1,
  applications: [{
    appRoot: "pkgs/frontend",
    frontend: {
      phases: {
        preBuild: {
          commands: [
            "corepack enable",
            "corepack prepare pnpm@latest --activate",
            "cd ../..",
            "pnpm install --frozen-lockfile",
            "cd pkgs/frontend",
            "pnpm run codegen",
          ]
        },
        build: {
          commands: ["pnpm run build"]
        }
      }
    }
  }]
})
```

### ブランチ設定

デフォルトで以下のブランチが設定されています:

- **main** - 本番環境（PRODUCTION）
- **develop** - 開発環境（DEVELOPMENT）

必要に応じて、CDKスタックを編集して追加のブランチを設定できます。

## 🔧 カスタマイズ

### リポジトリ情報の変更

`pkgs/cdk/lib/cdk-appsync-demo-stack.ts`の以下の部分を変更:

```typescript
sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
  owner: "your-github-username",    // GitHubユーザー名
  repository: "your-repository-name", // リポジトリ名
  oauthToken: githubToken.secretValue,
}),
```

### ブランチの追加

新しいブランチを追加する場合:

```typescript
amplifyApp.addBranch("feature-branch", {
  stage: "DEVELOPMENT",
  branchName: "feature-branch",
  autoBuild: true,
});
```

### カスタムドメインの設定

カスタムドメインを使用する場合:

```typescript
const domain = amplifyApp.addDomain("example.com", {
  enableAutoSubdomain: true,
});

domain.mapSubDomain(mainBranch, "www");
```

## 🐛 トラブルシューティング

### ビルドが失敗する場合

#### 1. pnpmのインストールエラー

**エラー**: `pnpm: command not found`

**解決策**: ビルド設定で`corepack enable`が実行されていることを確認

#### 2. GraphQL Code Generationエラー

**エラー**: `Cannot find module './gql/graphql'`

**解決策**:
- `codegen.ts`が正しく設定されているか確認
- AppSyncエンドポイントが正しく環境変数に設定されているか確認

#### 3. 環境変数が設定されていない

**エラー**: ビルドは成功するが、アプリが動作しない

**解決策**:
- CDKスタックで環境変数が正しく設定されているか確認
- `cdk deploy`を再実行して環境変数を更新

### GitHubトークンのエラー

**エラー**: `Invalid GitHub token`

**解決策**:
1. トークンに適切な権限があることを確認
2. Secrets Managerにトークンが正しく保存されているか確認:
   ```bash
   aws secretsmanager get-secret-value --secret-id github-token
   ```

### デプロイがタイムアウトする

**解決策**:
1. 依存関係のキャッシュを活用
2. ビルド設定で不要なステップを削除
3. Amplifyのビルドインスタンスタイプを変更

## 📊 コスト最適化

### ビルドコストの削減

- 不要なブランチの自動ビルドを無効化
- キャッシュを活用してビルド時間を短縮
- プルリクエストのプレビューを必要な場合のみ有効化

### ホスティングコストの削減

- 不要な環境を削除
- CloudFrontのキャッシュ設定を最適化
- アクセスログを必要に応じて無効化

## 🔒 セキュリティのベストプラクティス

### GitHubトークンの管理

- ✅ Secrets Managerを使用してトークンを保存
- ✅ 最小権限のトークンを使用
- ✅ 定期的にトークンをローテーション
- ❌ トークンをコードにハードコードしない

### 環境変数の管理

- ✅ 機密情報はSecrets Managerを使用
- ✅ 環境変数はビルド時にのみ注入
- ❌ APIキーをクライアント側に公開しない（NEXT_PUBLIC_は例外）

### アクセス制御

- AppSync APIにIAM認証を追加
- Amplifyアプリに基本認証を設定（開発環境）
- WAFルールでアクセスを制限

## 📚 参考リンク

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [AWS CDK Amplify Construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-amplify-alpha-readme.html)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [pnpm Documentation](https://pnpm.io/)

## 🔄 CI/CD統合

このセットアップにより、以下のCI/CDフローが自動的に構成されます:

1. **コミット** → GitHubリポジトリにプッシュ
2. **トリガー** → Amplifyが自動的にビルドを開始
3. **ビルド** → pnpm + Next.jsでアプリケーションをビルド
4. **デプロイ** → ビルド成果物をホスティング環境にデプロイ
5. **検証** → デプロイの健全性をチェック

### ブランチごとの環境

- `main` → 本番環境 (`https://main.dxxxxx.amplifyapp.com`)
- `develop` → 開発環境 (`https://develop.dxxxxx.amplifyapp.com`)

## 📝 まとめ

このガイドに従うことで、以下が実現されます:

✅ CDKによるインフラストラクチャのコード化
✅ GitHubとの自動連携
✅ 環境変数の自動設定
✅ CI/CDパイプラインの構築
✅ マルチブランチデプロイ

問題が発生した場合は、トラブルシューティングセクションを参照するか、AWS Amplifyのドキュメントを確認してください。
