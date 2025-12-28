#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { CdkAppsyncDemoStack } from "../lib/cdk-appsync-demo-stack";

// CDKのデフォルトリージョンを環境変数から読み込む
const env = {
	account: process.env.CDK_DEFAULT_ACCOUNT,
	region: process.env.CDK_DEFAULT_REGION,
};
const app = new cdk.App();
// スタックのインスタンス化
new CdkAppsyncDemoStack(app, "CdkAppsyncDemoStack", { env });
