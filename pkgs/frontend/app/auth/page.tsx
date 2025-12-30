"use client";

import { useAuth } from "@/context/auth-context";
import { amplifyConfig } from "@/lib/amplify-config";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";


// Amplifyを初期化 (クライアントサイド)
if (typeof window !== "undefined") {
  Amplify.configure(amplifyConfig, { ssr: true });
}

/**
 * 認証ページ
 *
 * Amplify UIのAuthenticatorコンポーネントを使用して、
 * サインアップ、サインイン、パスワードリセットなどの
 * 認証機能を提供します。
 */
export default function AuthPage() {
	const router = useRouter();
	const { user, loading, refreshUser } = useAuth();

	// 認証済みユーザーを自動的にホームページにリダイレクト
	// AuthContext が Hub イベントを監視しているため、
	// 認証状態が変更されると自動的に user が更新される
	useEffect(() => {
		if (!loading && user) {
			router.replace("/");
		}
	}, [user, loading, router]);

	// ローディング中の表示
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#020617]">
				<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	// 認証済みの場合は何も表示しない（リダイレクト中）
	if (user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#020617]">
				<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen relative flex items-center justify-center p-4">
			{/* Animated Background Layers */}
			<div className="absolute inset-0 bg-[#020617] overflow-hidden">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
				<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
			</div>

			<div className="relative z-10 w-full max-w-[min(480px,95vw)] animate-in fade-in zoom-in duration-700">
				{/* Premium Glass Container */}
				<div className="glass rounded-[2.5rem] p-1 shadow-2xl">
					<div className="bg-[#0f172a]/40 backdrop-blur-2xl rounded-[2.25rem] p-6 sm:p-10">
						{/* Header Section */}
						<div className="text-center mb-10 space-y-3">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[1px] mb-4">
								<div className="w-full h-full bg-[#0f172a] rounded-[calc(1rem-1px)] flex items-center justify-center">
									<div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-lg shadow-blue-500/20" />
								</div>
							</div>
							<h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
								AppSync <span className="text-blue-400">Sample</span>
							</h1>
							<p className="text-slate-400 font-medium">
								次世代の車両データ管理システムへ
							</p>
						</div>

						{/* Authenticator with Theme-aware styling */}
						<Authenticator
							formFields={{
								signIn: {
									username: {
										label: "メールアドレス",
										placeholder: "example@email.com",
									},
									password: {
										label: "パスワード",
										placeholder: "パスワードを入力",
									},
								},
								signUp: {
									email: {
										label: "メールアドレス",
										placeholder: "example@email.com",
										order: 1,
									},
									password: {
										label: "パスワード",
										placeholder: "パスワードを入力",
										order: 2,
									},
									confirm_password: {
										label: "パスワード（確認）",
										placeholder: "パスワードを再入力",
										order: 3,
									},
								},
							}}
							components={{
								Header() {
									return null;
								},
								Footer() {
									return (
										<div className="text-center mt-6">
											<p className="text-xs text-slate-500">
												続行することで、利用規約とプライバシーポリシーに同意したことになります。
											</p>
										</div>
									);
								},
							}}
						>
							{({ user: authUser }) => {
								// 認証成功時に AuthContext を更新する補助コンポーネント
								const AuthSync = () => {
									const hasSynced = useRef(false);

									useEffect(() => {
										if (authUser && !hasSynced.current) {
											hasSynced.current = true;
											refreshUser();
										}
									}, [authUser]);

									return (
										<div className="h-8 flex items-center justify-center">
											<div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
										</div>
									);
								};

								return <AuthSync />;
							}}
						</Authenticator>
					</div>
				</div>

				{/* Global Footer */}
				<div className="mt-8 flex flex-col items-center gap-4">
					<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
						<span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
							Secure System Online
						</span>
					</div>
					<p className="text-slate-500 text-sm">
						&copy; 2025 AppSync Sample. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}
