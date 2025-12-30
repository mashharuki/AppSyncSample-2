"use client";

import { useAuth } from "@/context/auth-context";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * ヘッダーコンポーネント
 *
 * ナビゲーションとユーザー認証情報を表示します。
 */
export default function Header() {
	const { user, signOut } = useAuth();
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.push("/auth");
	};

	return (
		<header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* ロゴとナビゲーション */}
					<div className="flex items-center space-x-8">
						<Link href="/" className="text-2xl font-bold text-white">
							AppSync Sample
						</Link>

						<nav className="hidden md:flex space-x-6">
							<Link
								href="/"
								className="text-gray-300 hover:text-white transition-colors"
							>
								車両検索
							</Link>
							<Link
								href="/cars"
								className="text-gray-300 hover:text-white transition-colors"
							>
								全車両一覧
							</Link>
						</nav>
					</div>

					{/* ユーザー情報とログアウト */}
					<div className="flex items-center space-x-4">
						{user ? (
							<>
								{/* ユーザー情報 */}
								<div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
									<User className="w-5 h-5 text-blue-400" />
									<span className="text-white text-sm font-medium">
										{user.email || user.username}
									</span>
								</div>

								{/* ログアウトボタン */}
								<button
									type="button"
									onClick={handleSignOut}
									className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-full transition-all duration-200 border border-red-500/30"
								>
									<LogOut className="w-4 h-4" />
									<span className="text-sm font-medium">ログアウト</span>
								</button>
							</>
						) : (
							<>
								{/* ログインボタン */}
								<Link
									href="/auth"
									className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-4 py-2 rounded-full transition-all duration-200 border border-blue-500/30"
								>
									<User className="w-4 h-4" />
									<span className="text-sm font-medium">ログイン</span>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
