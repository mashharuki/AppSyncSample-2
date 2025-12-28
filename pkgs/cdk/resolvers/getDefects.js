import { util } from "@aws-appsync/utils";

/**
 * DynamoDBテーブルをクエリし、返されるアイテム数を制限し、提供された `nextToken` でページネーションを行います
 * @param {import('@aws-appsync/utils').Context<{id: string; limit?: number; nextToken?:string}>} ctx コンテキスト
 * @returns {import('@aws-appsync/utils').DynamoDBQueryRequest} リクエスト
 * defect-by-licenseplate
 */
export function request(ctx) {
	const limit = 20;
	const query = JSON.parse(
		util.transform.toDynamoDBConditionExpression({
			licenseplate: { eq: ctx.source.licenseplate },
		}),
	);

	return { operation: "Query", index: "defect-by-licenseplate", query, limit };
}

/**
 * Returns the query items
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {[*]} a flat list of result items
 */
export function response(ctx) {
	if (ctx.error) {
		util.error(ctx.error.message, ctx.error.type);
	}
	return ctx.result.items;
}
