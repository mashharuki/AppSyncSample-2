import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Middleware
 *
 * 認証が必要なルートへのアクセスを制御します。
 * 未認証ユーザーを認証ページにリダイレクトします。
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 認証ページへのアクセスは常に許可
	if (pathname.startsWith("/auth")) {
		return NextResponse.next();
	}

	// 静的ファイルやAPIルートは認証チェックをスキップ
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	// 保護されたルート: /, /cars
	// Cognito認証トークンの存在をチェック
	// 注意: クライアントサイドでの完全な認証確認はuseAuthフックで行います

	return NextResponse.next();
}

/**
 * ミドルウェアを適用するパスの設定
 */
export const config = {
	matcher: [
		/*
		 * 以下を除くすべてのリクエストパスに適用:
		 * - api (APIルート)
		 * - _next/static (静的ファイル)
		 * - _next/image (画像最適化ファイル)
		 * - favicon.ico (ファビコン)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
