"use client";

import { getCurrentUser, signOut } from "aws-amplify/auth";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

/**
 * 認証ユーザー情報の型
 */
export interface AuthUser {
	userId: string;
	email?: string;
	username: string;
}

/**
 * 認証コンテキストの型定義
 */
interface AuthContextType {
	user: AuthUser | null;
	loading: boolean;
	error: Error | null;
	signOut: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

/**
 * 認証コンテキスト
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 認証プロバイダーコンポーネント
 *
 * アプリケーション全体で認証状態を管理し、子コンポーネントに提供します。
 *
 * @param children - 子コンポーネント
 */
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	/**
	 * 現在のユーザー情報を取得
	 */
	const fetchUser = async () => {
		try {
			setLoading(true);
			setError(null);

			const currentUser = await getCurrentUser();

			// ユーザー情報を設定
			setUser({
				userId: currentUser.userId,
				username: currentUser.username,
				email: currentUser.signInDetails?.loginId,
			});
		} catch (err) {
			// 未認証の場合はエラーとして扱わない
			if (err instanceof Error && err.name !== "UserUnAuthenticatedException") {
				console.error("Failed to fetch user:", err);
				setError(err);
			}
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * サインアウト処理
	 */
	const handleSignOut = async () => {
		try {
			await signOut();
			setUser(null);
		} catch (err) {
			console.error("Failed to sign out:", err);
			if (err instanceof Error) {
				setError(err);
			}
		}
	};

	/**
	 * ユーザー情報の再取得
	 */
	const refreshUser = async () => {
		await fetchUser();
	};

	// コンポーネントマウント時にユーザー情報を取得
	useEffect(() => {
		fetchUser();
	}, []);

	const value: AuthContextType = {
		user,
		loading,
		error,
		signOut: handleSignOut,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 認証コンテキストを使用するカスタムフック
 *
 * @throws {Error} AuthProviderの外で使用された場合
 * @returns 認証コンテキストの値
 */
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
