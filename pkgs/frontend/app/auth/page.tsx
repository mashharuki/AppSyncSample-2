"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 認証ページ
 *
 * Amplify UIのAuthenticatorコンポーネントを使用して、
 * サインアップ、サインイン、パスワードリセットなどの
 * 認証機能を提供します。
 */
export default function AuthPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
			<div className="w-full max-w-md">
				{/* グラスモーフィズムエフェクトのコンテナ */}
				<div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
					{/* ヘッダー */}
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-white mb-2">
							AppSync Sample
						</h1>
						<p className="text-gray-300">
							サインインまたは新規登録してください
						</p>
					</div>

					{/* Authenticatorコンポーネント */}
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
							confirmSignUp: {
								confirmation_code: {
									label: "確認コード",
									placeholder: "メールに送信された確認コードを入力",
								},
							},
							forgotPassword: {
								username: {
									label: "メールアドレス",
									placeholder: "example@email.com",
								},
							},
							confirmResetPassword: {
								confirmation_code: {
									label: "確認コード",
									placeholder: "メールに送信された確認コードを入力",
								},
								password: {
									label: "新しいパスワード",
									placeholder: "新しいパスワードを入力",
								},
								confirm_password: {
									label: "新しいパスワード（確認）",
									placeholder: "新しいパスワードを再入力",
								},
							},
						}}
						components={{
							Header() {
								return null; // カスタムヘッダーを既に表示しているため非表示
							},
						}}
					>
						{({ signOut, user }) => {
							// 認証成功時にホームページにリダイレクト
							if (user) {
								router.push("/");
							}
							return <div />;
						}}
					</Authenticator>
				</div>

				{/* フッター */}
				<p className="text-center text-gray-400 mt-6 text-sm">
					AWS Cognitoによる安全な認証
				</p>
			</div>
		</div>
	);
}
