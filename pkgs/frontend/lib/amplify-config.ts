import type { ResourcesConfig } from "aws-amplify";

/**
 * 必須環境変数のバリデーション
 */
function validateEnvironmentVariables(): {
  isValid: boolean;
  missingVars: string[];
} {
  const requiredVars = [
    "NEXT_PUBLIC_USER_POOL_ID",
    "NEXT_PUBLIC_USER_POOL_CLIENT_ID",
    "NEXT_PUBLIC_APPSYNC_ENDPOINT",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// 環境変数のバリデーション
const validation = validateEnvironmentVariables();

// クライアント側でのみ警告を表示
if (typeof window !== "undefined" && !validation.isValid) {
  console.error(
    "[Amplify Config Error]: 必須の環境変数が設定されていません:",
    validation.missingVars
  );
  console.error(
    "認証とAPIコールが失敗する可能性があります。.env.localファイルを確認してください。"
  );
}

/**
 * Amplify設定
 * 
 * 環境変数が正しく設定されていない場合、空文字列をデフォルト値として使用します。
 * これにより、開発環境で.env.localが未設定の場合でもビルドエラーを回避できます。
 */
export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT || "",
      region: process.env.NEXT_PUBLIC_AWS_REGION || "ap-northeast-1",
      // Cognito User Pool認証に変更
      defaultAuthMode: "userPool",
      apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY || "",
    },
  },
};

/**
 * 環境変数が正しく設定されているかチェック
 */
export function isAmplifyConfigured(): boolean {
  return validation.isValid;
}
