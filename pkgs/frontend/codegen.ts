import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../cdk/graphql/schema.graphql",
  documents: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
  generates: {
    "./lib/graphql/generated.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
