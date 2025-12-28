"use client";

import { Amplify } from "aws-amplify";
import { amplifyConfig } from "./amplify-config";

// Amplifyを初期化
Amplify.configure(amplifyConfig, { ssr: true });

export { generateClient } from "aws-amplify/api";
