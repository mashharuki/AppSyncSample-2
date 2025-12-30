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
				AuthenticationType: "AMAZON_COGNITO_USER_POOLS",
				XrayEnabled: true,
			});
		});

		test("Cognito User Pool 認証が設定される", () => {
			template.hasResourceProperties("AWS::AppSync::GraphQLApi", {
				Name: "carAPI",
				AuthenticationType: "AMAZON_COGNITO_USER_POOLS",
				UserPoolConfig: {},
			});
		});

		test("追加認証モードとして API_KEY が設定される", () => {
			template.hasResourceProperties("AWS::AppSync::GraphQLApi", {
				AdditionalAuthenticationProviders: [
					{
						AuthenticationType: "API_KEY",
					},
					{
						AuthenticationType: "AWS_IAM",
					},
				],
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

		test("listCars 関数が作成される", () => {
			template.hasResourceProperties("AWS::AppSync::FunctionConfiguration", {
				Name: "listCars",
				Runtime: {
					Name: "APPSYNC_JS",
					RuntimeVersion: "1.0.0",
				},
			});
		});

		test("AppSync 関数が 3 つ作成される", () => {
			template.resourceCountIs("AWS::AppSync::FunctionConfiguration", 3);
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

		test("Query.listCars リゾルバーが作成される", () => {
			template.hasResourceProperties("AWS::AppSync::Resolver", {
				TypeName: "Query",
				FieldName: "listCars",
				Kind: "PIPELINE",
				Runtime: {
					Name: "APPSYNC_JS",
					RuntimeVersion: "1.0.0",
				},
			});
		});

		test("リゾルバーが 3 つ作成される", () => {
			template.resourceCountIs("AWS::AppSync::Resolver", 3);
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
	// Cognito User Pool のテスト
	// ==================================================

	describe("Cognito User Pool", () => {
		test("User Pool が作成される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPool", {
				UserPoolName: "appsync-sample-user-pool",
				UsernameAttributes: ["email"],
			});
		});

		test("User Pool でメール検証が有効化される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPool", {
				AutoVerifiedAttributes: ["email"],
			});
		});

		test("User Pool でセルフサインアップが有効化される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPool", {
				AdminCreateUserConfig: {
					AllowAdminCreateUserOnly: false,
				},
			});
		});

		test("User Pool でパスワードポリシーが設定される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPool", {
				Policies: {
					PasswordPolicy: {
						MinimumLength: 8,
						RequireLowercase: true,
						RequireUppercase: true,
						RequireNumbers: true,
						RequireSymbols: false,
					},
				},
			});
		});

		test("User Pool でアカウントリカバリー設定が有効化される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPool", {
				AccountRecoverySetting: {
					RecoveryMechanisms: [
						{
							Name: "verified_email",
							Priority: 1,
						},
					],
				},
			});
		});

		test("User Pool が 1 つ作成される", () => {
			template.resourceCountIs("AWS::Cognito::UserPool", 1);
		});
	});

	// ==================================================
	// Cognito User Pool Client のテスト
	// ==================================================

	describe("Cognito User Pool Client", () => {
		test("User Pool Client が作成される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
				ClientName: "appsync-sample-web-client",
			});
		});

		test("User Pool Client で認証フローが設定される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
				ExplicitAuthFlows: [
					"ALLOW_USER_PASSWORD_AUTH",
					"ALLOW_USER_SRP_AUTH",
					"ALLOW_REFRESH_TOKEN_AUTH",
				],
			});
		});

		test("User Pool Client で OAuth 設定が有効化される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
				AllowedOAuthFlows: ["code"],
				AllowedOAuthFlowsUserPoolClient: true,
				AllowedOAuthScopes: ["email", "openid", "profile"],
			});
		});

		test("User Pool Client でトークン有効期限が設定される", () => {
			template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
				AccessTokenValidity: 60, // 1時間（分単位）
				IdTokenValidity: 60, // 1時間（分単位）
				RefreshTokenValidity: 43200, // 30日（分単位）
			});
		});

		test("User Pool Client が 1 つ作成される", () => {
			template.resourceCountIs("AWS::Cognito::UserPoolClient", 1);
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

		test("User Pool ID が出力される", () => {
			const outputs = template.findOutputs("UserPoolId");
			expect(Object.keys(outputs)).toHaveLength(1);
			expect(outputs.UserPoolId).toBeDefined();
		});

		test("User Pool Client ID が出力される", () => {
			const outputs = template.findOutputs("UserPoolClientId");
			expect(Object.keys(outputs)).toHaveLength(1);
			expect(outputs.UserPoolClientId).toBeDefined();
		});

		test("User Pool ARN が出力される", () => {
			const outputs = template.findOutputs("UserPoolArn");
			expect(Object.keys(outputs)).toHaveLength(1);
			expect(outputs.UserPoolArn).toBeDefined();
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
