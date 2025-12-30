# 認証後の無限レンダリング問題の解決

## 問題の症状
認証成功後、無限レンダリングが発生。リロードすると正しく認証後の画面が表示される。

## 根本原因
1. `/auth` ページで認証成功 → `/` にリダイレクト
2. `/` の `ProtectedRoute` が認証チェック → まだ AuthContext が更新されていない
3. 未認証と判断 → `/auth` にリダイレクト
4. `/auth` で認証済みと判断 → 再び `/` にリダイレクト
5. **無限ループ発生**

## 解決策

### 1. AuthContext の改善 (pkgs/frontend/context/auth-context.tsx)

Amplify Hub イベントを監視して、認証状態の変更を自動検出：

```typescript
import { Hub } from "aws-amplify/utils";

useEffect(() => {
	fetchUser();

	// Amplify Hub で認証イベントをリッスン
	const hubListener = Hub.listen("auth", ({ payload }) => {
		const { event } = payload;
		
		// 認証状態が変更されたらユーザー情報を再取得
		if (
			event === "signInWithRedirect" ||
			event === "tokenRefresh" ||
			event === "signedOut"
		) {
			fetchUser();
		}
	});

	return () => hubListener();
}, []);
```

### 2. 認証ページの改善 (pkgs/frontend/app/auth/page.tsx)

認証済みユーザーを自動的にリダイレクト：

```typescript
useEffect(() => {
	if (!loading && user) {
		router.replace("/");  // push ではなく replace を使用
	}
}, [user, loading, router]);
```

### 3. Authenticator の子要素で明示的に同期

`useRef` を使って一度だけ `refreshUser()` を呼び出し：

```typescript
{({ user: authUser }) => {
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
```

## 重要なポイント

1. **Hub イベント監視**: AuthContext で Amplify の認証イベントを監視することで、認証状態の変更を即座に検出
2. **useRef によるフラグ管理**: 一度だけ処理を実行することで無限ループを防止
3. **router.replace() の使用**: `push()` ではなく `replace()` を使うことで、ブラウザ履歴をクリーンに保つ
4. **階層的な認証状態管理**: AuthContext (グローバル) と Authenticator (ローカル) の両方で状態を管理し、同期を取る

## 結果

認証後、リロードせずにスムーズに認証後の画面に遷移できるようになった。
