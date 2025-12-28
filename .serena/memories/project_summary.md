# Project Summary

This project is a monorepo using pnpm workspaces, consisting of an AWS CDK backend and a Next.js frontend.
It demonstrates an AppSync API backed by DynamoDB tables with a frontend application.

## Structure
- **Root**: Monorepo root with shared configuration (Biome).
- **pkgs/cdk**: AWS CDK infrastructure code.
  - **AppSync API**: Named `carAPI`.
  - **DynamoDB Tables**: `cardata-cars` (cars) and `cardata-defects` (defects).
  - **Resolvers**: JavaScript resolvers for AppSync.
- **pkgs/frontend**: Next.js web application.

## Key Features
- **Backend**:
  - One-to-many relationship between "cars" and "defects".
  - Public RDW data source.
- **Frontend**:
  - Modern React application consuming the AppSync API.

## Architecture
- **Infrastructure**: Defined in `pkgs/cdk/lib/cdk-appsync-demo-stack.ts`.
- **Schema**: GraphQL schema in `pkgs/cdk/graphql/schema.graphql`.
- **Web App**: Located in `pkgs/frontend`.
