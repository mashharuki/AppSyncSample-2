"use client";

import { Amplify } from "aws-amplify";
import { amplifyConfig, isAmplifyConfigured } from "./amplify-config";

// Amplifyを初期化（SSRモード対応）
try {
  Amplify.configure(amplifyConfig, { ssr: true });
  
  // クライアント側でのみログを出力
  if (typeof window !== "undefined") {
    if (isAmplifyConfigured()) {
      console.log("[Amplify] 設定が正常に読み込まれました");
    } else {
      console.warn("[Amplify] 環境変数が不足しています。認証機能が正常に動作しない可能性があります。");
    }
  }
} catch (error) {
  console.error("[Amplify] 設定の初期化に失敗しました:", error);
}

export { generateClient } from "aws-amplify/api";
