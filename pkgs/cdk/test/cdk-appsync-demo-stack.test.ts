import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CdkAppsyncDemoStack } from "../lib/cdk-appsync-demo-stack";

/**
 * CDK AppSync Demo Stack のユニットテスト
 *
 * このテストスイートは、以下のインフラストラクチャコンポーネントが
 * 正しく構成されていることを検証します：
 *
 * - DynamoDB テーブル (Cars, Defects) とその設定
 * - AppSync GraphQL API の構成と認証設定
 * - データソースの接続
 * - AppSync 関数 (getCars, getDefects)
 * - パイプラインリゾルバー
 * - IAM ロールとポリシー
 * - CloudFormation 出力
 *
 * テストの実行:
 *   pnpm --filter cdk test
 *   pnpm test -- --coverage  (カバレッジレポート付き)
 */
describe("CdkAppsyncDemoStack", () => {
	let template: Template;

	beforeAll(() => {
		const app = new cdk.App();
		const stack = new CdkAppsyncDemoStack(app, "TestStack");
		template = Template.fromStack(stack);
	});

	// ==================================================
	// DynamoDB テーブルのテスト
	// ==================================================

	describe("DynamoDB Tables", () => {
		test("Cars テーブルが正しく作成される", () => {
			template.hasResourceProperties("AWS::DynamoDB::Table", {
				TableName: "cardata-cars",
				KeySchema: [
					{
						AttributeName: "licenseplate",
						KeyType: "HASH",
					},
				],
				AttributeDefinitions: [
					{
						AttributeName: "licenseplate",
						AttributeType: "S",
					},
				],
				ProvisionedThroughput: {
					ReadCapacityUnits: 2,
					WriteCapacityUnits: 4,
				},
			});
		});

		test("Defects テーブルが正しく作成される", () => {
			template.hasResourceProperties("AWS::DynamoDB::Table", {
				TableName: "cardata-defects",
				KeySchema: [
					{
						AttributeName: "id",
						KeyType: "HASH",
					},
				],
				AttributeDefinitions: [
					{
						AttributeName: "id",
						AttributeType: "S",
					},
					{
						AttributeName: "licenseplate",
						AttributeType: "S",
					},
				],
				ProvisionedThroughput: {
					ReadCapacityUnits: 2,
					WriteCapacityUnits: 4,
				},
			});
		});

		test("Defects テーブルに GSI が設定されている", () => {
			template.hasResourceProperties("AWS::DynamoDB::Table", {
				TableName: "cardata-defects",
				GlobalSecondaryIndexes: [
					{
						IndexName: "defect-by-licenseplate",
						KeySchema: [
							{
								AttributeName: "licenseplate",
								KeyType: "HASH",
							},
						],
						Projection: {
							ProjectionType: "ALL",
						},
						ProvisionedThroughput: {
							ReadCapacityUnits: 2,
							WriteCapacityUnits: 4,
						},
					},
				],
			});
		});

		test("DynamoDB テーブルが 2 つ作成される", () => {
			template.resourceCountIs("AWS::DynamoDB::Table", 2);
		});
	});

	// ==================================================
	// AppSync API のテスト
	// ==================================================

	describe("AppSync GraphQL API", () => {
		test("GraphQL API が作成される", () => {
			template.hasResourceProperties("AWS::AppSync::GraphQLApi", {
				Name: "carAPI",
				AuthenticationType: "API_KEY",
				XrayEnabled: true,
			});
		});

		test("API Key 認証モードが設定される", () => {
			template.hasResourceProperties("AWS::AppSync::ApiKey", {});
		});

		test("GraphQL API が 1 つ作成される", () => {
			template.resourceCountIs("AWS::AppSync::GraphQLApi", 1);
		});

		test("GraphQL Schema が定義される", () => {
			template.hasResourceProperties("AWS::AppSync::GraphQLSchema", {});
		});
	});

	// ==================================================
	// データソースのテスト
	// ==================================================

	describe("AppSync DataSources", () => {
		test("Cars データソースが作成される", () => {
			template.hasResourceProperties("AWS::AppSync::DataSource", {
				Type: "AMAZON_DYNAMODB",
			});
		});

		test("Defects データソースが作成される", () => {
			template.hasResourceProperties("AWS::AppSync::DataSource", {
				Type: "AMAZON_DYNAMODB",
			});
		});

		test("データソースが 2 つ作成される", () => {
			template.resourceCountIs("AWS::AppSync::DataSource", 2);
		});
	});

	// ==================================================
	// AppSync 関数のテスト
	// ==================================================

	describe("AppSync Functions", () => {
		test("getCars 関数が作成される", () => {
			template.hasResourceProperties("AWS::AppSync::FunctionConfiguration", {
				Name: "getCars",
				Runtime: {
					Name: "APPSYNC_JS",
					RuntimeVersion: "1.0.0",
				},
			});
		});

		test("getDefects 関数が作成される", () => {
			template.hasResourceProperties("AWS::AppSync::FunctionConfiguration", {
				Name: "getDefects",
				Runtime: {
					Name: "APPSYNC_JS",
					RuntimeVersion: "1.0.0",
				},
			});
		});

		test("AppSync 関数が 2 つ作成される", () => {
			template.resourceCountIs("AWS::AppSync::FunctionConfiguration", 2);
		});
	});

	// ==================================================
	// リゾルバーのテスト
	// ==================================================

	describe("AppSync Resolvers", () => {
		test("Query.getCar リゾルバーが作成される", () => {
			template.hasResourceProperties("AWS::AppSync::Resolver", {
				TypeName: "Query",
				FieldName: "getCar",
				Kind: "PIPELINE",
				Runtime: {
					Name: "APPSYNC_JS",
					RuntimeVersion: "1.0.0",
				},
			});
		});

		test("Car.defects リゾルバーが作成される", () => {
			template.hasResourceProperties("AWS::AppSync::Resolver", {
				TypeName: "Car",
				FieldName: "defects",
				Kind: "PIPELINE",
				Runtime: {
					Name: "APPSYNC_JS",
					RuntimeVersion: "1.0.0",
				},
			});
		});

		test("リゾルバーが 2 つ作成される", () => {
			template.resourceCountIs("AWS::AppSync::Resolver", 2);
		});
	});

	// ==================================================
	// IAM ロールのテスト
	// ==================================================

	describe("IAM Roles", () => {
		test("AppSync 用の IAM ロールが作成される", () => {
			template.hasResourceProperties("AWS::IAM::Role", {
				AssumeRolePolicyDocument: {
					Statement: [
						{
							Action: "sts:AssumeRole",
							Effect: "Allow",
							Principal: {
								Service: "appsync.amazonaws.com",
							},
						},
					],
				},
			});
		});

		test("DynamoDB テーブルへのアクセス権限が付与される", () => {
			template.hasResourceProperties("AWS::IAM::Policy", {
				PolicyDocument: {
					Statement: [
						{
							Action: [
								"dynamodb:BatchGetItem",
								"dynamodb:GetRecords",
								"dynamodb:GetShardIterator",
								"dynamodb:Query",
								"dynamodb:GetItem",
								"dynamodb:Scan",
								"dynamodb:ConditionCheckItem",
								"dynamodb:BatchWriteItem",
								"dynamodb:PutItem",
								"dynamodb:UpdateItem",
								"dynamodb:DeleteItem",
								"dynamodb:DescribeTable",
							],
							Effect: "Allow",
						},
					],
				},
			});
		});
	});

	// ==================================================
	// CloudFormation 出力のテスト
	// ==================================================

	describe("CloudFormation Outputs", () => {
		test("GraphQL API URL が出力される", () => {
			template.hasOutput("GraphQLAPIURL", {});
		});

		test("GraphQL API Key が出力される", () => {
			template.hasOutput("GraphQLAPIKey", {});
		});

		test("Cars テーブル名が出力される", () => {
			const outputs = template.findOutputs("CarsTableName");
			expect(Object.keys(outputs)).toHaveLength(1);
			expect(outputs.CarsTableName).toBeDefined();
		});

		test("Defects テーブル名が出力される", () => {
			const outputs = template.findOutputs("DefectsTableName");
			expect(Object.keys(outputs)).toHaveLength(1);
			expect(outputs.DefectsTableName).toBeDefined();
		});
	});

	// ==================================================
	// スナップショットテスト
	// ==================================================

	describe("Stack Snapshot", () => {
		test("スタック全体のスナップショットが一致する", () => {
			expect(template.toJSON()).toMatchSnapshot();
		});
	});
});
