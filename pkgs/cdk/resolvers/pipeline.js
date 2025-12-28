/**
 * パイプラインリゾルバーのリクエストハンドラー
 * 前の関数の結果をそのまま渡すために空のオブジェクトを返します
 */
export function request(_ctx) {
	return {};
}

/**
 * パイプラインリゾルバーのレスポンスハンドラー
 * 前の関数の結果を返します
 */
export function response(ctx) {
	return ctx.prev.result;
}
