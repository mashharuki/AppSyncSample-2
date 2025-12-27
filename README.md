# AWS CDK AppSync DynamoDB Table Joining Demo

このプロジェクトは、AWS CDKを使用して、DynamoDBテーブルをバックエンドに持つAWS AppSync APIを構築するデモです。
特に、車（Cars）と不具合（Defects）という2つのテーブル間で1対多のリレーションシップを確立し、ネストされたクエリを実現する方法を示しています。

## 概要

このプロジェクトでは、`carAPI` というAppSync APIと、以下の2つのDynamoDBテーブルを作成します。

*   `cardata-cars`: 車の情報を格納
*   `cardata-defects`: 車に関連する不具合情報を格納

これらを連携させることで、特定の車の情報とその車に関連する不具合一覧を一度のGraphQLクエリで取得できます。
データはオランダのRDW（車両登録局）の公開データに基づいています。

## 提供している機能

*   **車情報の取得**: ナンバープレートを指定して車の詳細情報を取得。
*   **不具合情報の取得**: 車情報に紐付く不具合情報のリストを取得（ネストされたクエリ）。
*   **データ投入ツール**: サンプルデータをDynamoDBに一括投入するユーティリティ。

## システム構成図

```mermaid
graph TD
    Client[Client] -->|GraphQL Query| AppSync["AWS AppSync (carAPI)"]
    AppSync -->|GetItem| CarsTable["DynamoDB: cardata-cars"]
    AppSync -->|"Query (GSI)"| DefectsTable["DynamoDB: cardata-defects"]
    
    subgraph DynamoDB
        CarsTable
        DefectsTable
    end
```

![Architecture](./docs/appsync-architecture.png)

## 処理シーケンス図

**`getCar` クエリ実行時のフロー**

```mermaid
sequenceDiagram
    participant Client
    participant AppSync
    participant CarsResolver as getCar Resolver
    participant CarsTable as DynamoDB (Cars)
    participant DefectsResolver as getDefects Resolver
    participant DefectsTable as DynamoDB (Defects)

    Client->>AppSync: query GetCar(licenseplate: "...")
    
    par Fetch Car Data
        AppSync->>CarsResolver: Invoke
        CarsResolver->>CarsTable: GetItem (PK: licenseplate)
        CarsTable-->>CarsResolver: Car Item
        CarsResolver-->>AppSync: Car Data
    end

    par Fetch Defects Data (Nested)
        AppSync->>DefectsResolver: Invoke (source: Car Data)
        DefectsResolver->>DefectsTable: Query GSI (licenseplate)
        DefectsTable-->>DefectsResolver: Defects Items
        DefectsResolver-->>AppSync: Defects List
    end

    AppSync-->>Client: Combined JSON Response
```

## 技術スタック

*   **Infrastructure as Code**: AWS CDK (TypeScript)
*   **API**: AWS AppSync (GraphQL)
*   **Database**: Amazon DynamoDB
*   **Runtime**: Node.js (v18.x recommended)
*   **Package Manager**: pnpm
*   **Linter / Formatter**: Biome
*   **Testing**: Jest

## 動かし方

### 前提条件

*   Node.js (v18.x以上)
*   pnpm (`npm install -g pnpm`)
*   AWS CLI (設定済みであること)
*   AWS CDK (`npm install -g aws-cdk`)

### インストール

```bash
git clone <repository-url>
cd AppSyncSample-2
pnpm install
```

### ビルドとチェック

```bash
# TypeScriptのビルド
pnpm run build

# リントとフォーマットチェック
pnpm run lint

# フォーマットの自動修正
pnpm run format
```

### デプロイ

AWS環境へデプロイします。デフォルトでは `eu-central-1` リージョンが指定されていますが、環境変数で変更可能です。

```bash
# 環境変数を使用する場合
export CDK_DEFAULT_ACCOUNT=123456789012
export CDK_DEFAULT_REGION=ap-northeast-1
cdk deploy
```

### データ投入

デプロイ完了後、サンプルデータをDynamoDBに投入します。

```bash
pnpm run push-data
```

### 動作確認

AWSマネジメントコンソールのAppSyncクエリエディタ、または任意のGraphQLクライアントから以下のクエリを実行します。

```graphql
query GetCar {
  getCar(licenseplate: "BR794ZQ3") {
    expirydateapk
    cylindervolume
    catalogprice
    defects {
      defectdescription
      defectstartdate
      licenseplate
    }
    firstcolor
    firstregistrationdate
    licenseplate
  }
}
```

### クリーンアップ

リソースを削除する場合：

```bash
cdk destroy
```

## コストについて

このアーキテクチャの運用コストは、月額数ドル程度（eu-central-1リージョンに基づく）と見積もられます。`pnpm run push-data` コマンドの実行後、DynamoDBテーブルとインデックスの書き込み容量を低い設定に調整することで、コストを最適化できます。
