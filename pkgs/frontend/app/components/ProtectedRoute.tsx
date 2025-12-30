"use client";

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

/**
 * 保護されたルートのラッパーコンポーネント
 *
 * 認証が必要なページをラップし、未認証ユーザーを
 * 自動的にログインページにリダイレクトします。
 *
 * @param children - 保護するコンテンツ
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// ローディング完了後、未認証ユーザーをリダイレクト
		if (!loading && !user) {
			router.push("/auth");
		}
	}, [user, loading, router]);

	// ローディング中の表示
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
					<p className="text-white text-lg">読み込み中...</p>
				</div>
			</div>
		);
	}

	// 未認証の場合は何も表示しない（リダイレクト中）
	if (!user) {
		return null;
	}

	// 認証済みユーザーにはコンテンツを表示
	return <>{children}</>;
}
