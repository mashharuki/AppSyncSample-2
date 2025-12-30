import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  // 静的エクスポートを無効化（Amplify Hostingでのランタイム環境変数読み取りを有効にするため）
  output: "export",
};

export default nextConfig;
