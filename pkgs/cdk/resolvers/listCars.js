import { util } from "@aws-appsync/utils";

/**
 * DynamoDBテーブルから全車両データを取得するリクエスト
 * ページネーション対応のためにScanオペレーションを使用
 * @param {import('@aws-appsync/utils').Context} ctx コンテキスト
 * @returns {import('@aws-appsync/utils').DynamoDBScanRequest} リクエスト
 */
export function request(ctx) {
	const { limit = 20, nextToken } = ctx.args;

	return {
		operation: "Scan",
		limit,
		nextToken,
	};
}

/**
 * DynamoDBのスキャン結果を整形して返す
 * @param {import('@aws-appsync/utils').Context} ctx コンテキスト
 * @returns {*} ページネーション情報を含む車両リスト
 */
export function response(ctx) {
	const { error, result } = ctx;

	if (error) {
		return util.appendError(error.message, error.type, result);
	}

	const { items = [], nextToken } = result;

	return {
		items,
		nextToken,
	};
}
