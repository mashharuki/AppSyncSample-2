import type { ResourcesConfig } from "aws-amplify";

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

// 必須の環境変数が設定されているかチェック
if (typeof window !== "undefined") {
  // Next.jsはビルド時に環境変数を静的に置換するため、直接アクセスする必要がある
  if (!process.env.NEXT_PUBLIC_USER_POOL_ID) {
    console.warn(
      "[Amplify Config Warning]: NEXT_PUBLIC_USER_POOL_ID is not defined. Authentication or API calls may fail."
    );
  }
  
  if (!process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID) {
    console.warn(
      "[Amplify Config Warning]: NEXT_PUBLIC_USER_POOL_CLIENT_ID is not defined. Authentication or API calls may fail."
    );
  }
  
  if (!process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT) {
    console.warn(
      "[Amplify Config Warning]: NEXT_PUBLIC_APPSYNC_ENDPOINT is not defined. Authentication or API calls may fail."
    );
  }
}
