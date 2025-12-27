import * as cdk from "aws-cdk-lib";
import {
	AppsyncFunction,
	AuthorizationType,
	Code,
	Definition,
	FunctionRuntime,
	GraphqlApi,
	Resolver,
} from "aws-cdk-lib/aws-appsync";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import type { Construct } from "constructs";

import path = require("node:path");

/**
 * AppSyncとDynamoDBを使用したスタック
 */
export class CdkAppsyncDemoStack extends cdk.Stack {
	/**
	 * コンストラクター
	 * @param scope
	 * @param id
	 * @param props
	 */
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// DynamoDBテーブルの作成
		// 車の情報を格納するテーブル
		const carsTable = new Table(this, "CarTable", {
			partitionKey: { name: "licenseplate", type: AttributeType.STRING },
			tableName: "cardata-cars",
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			billingMode: BillingMode.PROVISIONED,
			readCapacity: 2,
			writeCapacity: 4,
		});

		// 不具合情報を格納するテーブル
		const defectsTable = new Table(this, "DefectsTable", {
			partitionKey: { name: "id", type: AttributeType.STRING },
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			tableName: "cardata-defects",
			billingMode: BillingMode.PROVISIONED,
			readCapacity: 2,
			writeCapacity: 4,
		});

		// ナンバープレートで不具合を検索するためのグローバルセカンダリインデックス (GSI) を追加
		defectsTable.addGlobalSecondaryIndex({
			indexName: "defect-by-licenseplate",
			partitionKey: {
				name: "licenseplate",
				type: AttributeType.STRING,
			},
			readCapacity: 2,
			writeCapacity: 4,
		});

		// AppSync API (GraphQL API) の作成
		const api = new GraphqlApi(this, "CarApi", {
			name: "carAPI",
			definition: Definition.fromFile(
				path.join(__dirname, "../graphql/schema.graphql"),
			),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: AuthorizationType.IAM,
				},
			},
			xrayEnabled: true,
		});

		// DynamoDBテーブルをAppSync APIのデータソースとして接続
		const carsDataSource = api.addDynamoDbDataSource(
			"CarsDataSource",
			carsTable,
		);
		const defectsDataSource = api.addDynamoDbDataSource(
			"DefectsDataSource",
			defectsTable,
		);

		// AppSync関数 (リゾルバー) の定義
		// 車情報を取得する関数
		const carsResolver = new AppsyncFunction(this, "CarsFunction", {
			name: "getCars",
			api,
			dataSource: carsDataSource,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/getCar.js")),
			runtime: FunctionRuntime.JS_1_0_0,
		});

		// 不具合情報を取得する関数
		const defectsResolver = new AppsyncFunction(this, "DefectsFunction", {
			name: "getDefects",
			api,
			dataSource: defectsDataSource,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/getDefects.js")),
			runtime: FunctionRuntime.JS_1_0_0,
		});

		// パイプラインリゾルバーの設定
		// Query.getCar に対するリゾルバー
		new Resolver(this, "PipelineResolverGetCars", {
			api,
			typeName: "Query",
			fieldName: "getCar",
			runtime: FunctionRuntime.JS_1_0_0,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/pipeline.js")),
			pipelineConfig: [carsResolver],
		});

		// Car.defects に対するリゾルバー (ネストされたクエリ用)
		new Resolver(this, "PipelineResolverGetDefects", {
			api,
			typeName: "Car",
			fieldName: "defects",
			runtime: FunctionRuntime.JS_1_0_0,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/pipeline.js")),
			pipelineConfig: [defectsResolver],
		});

		// =================================================-
		// CDKデプロイ時にAPIエンドポイントとテーブル名を出力
		// =================================================-

		new cdk.CfnOutput(this, "GraphQLAPIURL", {
			value: api.graphqlUrl,
		});

		new cdk.CfnOutput(this, "CarsTableName", {
			value: carsTable.tableName,
		});

		new cdk.CfnOutput(this, "DefectsTableName", {
			value: defectsTable.tableName,
		});
	}
}
