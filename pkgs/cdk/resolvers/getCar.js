import { util } from "@aws-appsync/utils";

/**
 * ID `ctx.args.id` を持つアイテムを取得するリクエストを送信します
 * @param {import('@aws-appsync/utils').Context} ctx コンテキスト
 * @returns {import('@aws-appsync/utils').DynamoDBGetItemRequest} リクエスト
 */
export function request(ctx) {
	return {
		operation: "GetItem",
		key: util.dynamodb.toMapValues({ licenseplate: ctx.args.licenseplate }),
	};
}

/**
 * 取得したDynamoDBアイテムを返します
 * @param {import('@aws-appsync/utils').Context} ctx コンテキスト
 * @returns {*} DynamoDBアイテム
 */
export function response(ctx) {
	return ctx.result;
}
