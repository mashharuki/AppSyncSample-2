import * as amplify from "@aws-cdk/aws-amplify-alpha";
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
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";
import * as dotenv from "dotenv";

// .envファイルの内容を環境変数にロード
dotenv.config();

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

		// ==================================================
		// DynamoDBテーブルの作成
		// ==================================================

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

		// ==================================================
		// AppSync API (GraphQL API) の作成
		// ==================================================

		// GraphQL APIの定義
		const api = new GraphqlApi(this, "CarApi", {
			name: "carAPI",
			// スキーマの読み込み
			definition: Definition.fromFile(
				path.join(__dirname, "../graphql/schema.graphql"),
			),
			// 認証設定
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: AuthorizationType.API_KEY,
				},
				additionalAuthorizationModes: [
					{
						authorizationType: AuthorizationType.IAM,
					},
				],
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

		// ==================================================
		// AppSync関数 (リゾルバー) の定義
		// ==================================================

		// 車情報を取得する関数（個別取得）
		const carsResolver = new AppsyncFunction(this, "CarsFunction", {
			name: "getCars",
			api,
			dataSource: carsDataSource,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/getCar.js")),
			runtime: FunctionRuntime.JS_1_0_0,
		});

		// 全車両を取得する関数（一覧取得）
		const listCarsResolver = new AppsyncFunction(this, "ListCarsFunction", {
			name: "listCars",
			api,
			dataSource: carsDataSource,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/listCars.js")),
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

		// ==================================================
		// パイプラインリゾルバーの設定
		// ==================================================

		// Query.getCar に対するリゾルバー
		new Resolver(this, "PipelineResolverGetCars", {
			api,
			typeName: "Query",
			fieldName: "getCar",
			runtime: FunctionRuntime.JS_1_0_0,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/pipeline.js")),
			pipelineConfig: [carsResolver],
		});

		// Query.listCars に対するリゾルバー
		new Resolver(this, "PipelineResolverListCars", {
			api,
			typeName: "Query",
			fieldName: "listCars",
			runtime: FunctionRuntime.JS_1_0_0,
			code: Code.fromAsset(path.join(__dirname, "../resolvers/pipeline.js")),
			pipelineConfig: [listCarsResolver],
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

		// ==================================================
		// AWS Amplify Hosting の設定
		// ==================================================

		// 環境変数からGitHubトークンを取得
		const githubTokenValue = process.env.GITHUB_TOKEN;
		if (!githubTokenValue) {
			throw new Error(
				"GITHUB_TOKEN environment variable is required for Amplify deployment",
			);
		}

		// Secret ManagerにGitHubトークンを作成
		const githubToken = new secretsmanager.Secret(this, "GitHubToken", {
			secretName: "github-token",
			secretStringValue: cdk.SecretValue.unsafePlainText(githubTokenValue),
			description: "GitHub Personal Access Token for Amplify Hosting",
		});

		// Amplify Appの作成
		const amplifyApp = new amplify.App(this, "FrontendApp", {
			appName: "appsync-sample-frontend",
			sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
				owner: "mashharuki", // GitHubユーザー名
				repository: "AppSyncSample-2", // リポジトリ名
				oauthToken: githubToken.secretValue,
			}),
			// 環境変数の設定
			environmentVariables: {
				NEXT_PUBLIC_APPSYNC_ENDPOINT: api.graphqlUrl,
				NEXT_PUBLIC_APPSYNC_API_KEY: api.apiKey || "",
				NEXT_PUBLIC_AWS_REGION: this.region,
			},
			// build設定
			buildSpec: cdk.aws_codebuild.BuildSpec.fromObjectToYaml({
				version: 1,
				applications: [
					{
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
									],
								},
								build: {
									commands: ["pnpm run build"],
								},
							},
							artifacts: {
								baseDirectory: "out",
								files: ["**/*"],
							},
							cache: {
								paths: [
									"../../node_modules/**/*",
									"node_modules/**/*",
									".next/cache/**/*",
								],
							},
						},
					},
				],
			}),
			// SPAルーティングのためのリダイレクトルールを追加
			customRules: [
				{
					source: "/<*>",
					target: "/index.html",
					status: amplify.RedirectStatus.NOT_FOUND_REWRITE,
				},
			],
		});

		// mainブランチを本番環境として設定
		amplifyApp.addBranch("main", {
			stage: "PRODUCTION",
			branchName: "main",
			autoBuild: true,
		});

		// 開発ブランチの追加（オプション）
		amplifyApp.addBranch("develop", {
			stage: "DEVELOPMENT",
			branchName: "develop",
			autoBuild: true,
		});

		// =================================================-
		// CDKデプロイ時にAPIエンドポイントとテーブル名を出力
		// =================================================-

		new cdk.CfnOutput(this, "GraphQLAPIURL", {
			value: api.graphqlUrl,
		});

		new cdk.CfnOutput(this, "GraphQLAPIKey", {
			value: api.apiKey || "",
		});

		new cdk.CfnOutput(this, "CarsTableName", {
			value: carsTable.tableName,
		});

		new cdk.CfnOutput(this, "DefectsTableName", {
			value: defectsTable.tableName,
		});

		new cdk.CfnOutput(this, "AmplifyAppId", {
			value: amplifyApp.appId,
			description: "Amplify App ID",
		});

		new cdk.CfnOutput(this, "AmplifyAppURL", {
			value: `https://main.${amplifyApp.defaultDomain}`,
			description: "Amplify App URL",
		});
	}
}
