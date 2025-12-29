# Project Summary

This project is a monorepo using pnpm workspaces, consisting of an AWS CDK backend and a Next.js frontend.
It demonstrates an AppSync API backed by DynamoDB tables with a modern, stylish frontend application.

## Structure
- **Root**: Monorepo root with shared configuration (Biome).
- **pkgs/cdk**: AWS CDK infrastructure code.
  - **AppSync API**: Named `carAPI`.
  - **DynamoDB Tables**: `cardata-cars` (cars) and `cardata-defects` (defects).
  - **Resolvers**: JavaScript resolvers for AppSync.
- **pkgs/frontend**: Next.js web application.

## Key Features

### Backend
- One-to-many relationship between "cars" and "defects".
- Public RDW data source.
- **GraphQL Queries**:
  - `getCar(licenseplate: String!)`: Get individual car by license plate
  - `listCars(limit: Int, nextToken: String)`: Get all cars with pagination support
- **Pagination**: Uses DynamoDB Scan with nextToken for efficient data retrieval

### Frontend
- **Modern UI Design**: 
  - Glass morphism effects with backdrop blur
  - Animated gradients and floating elements
  - Dark theme with blue/purple accents
  - Smooth transitions and hover effects
- **Pages**:
  - `/`: Home page with car search by license plate
  - `/cars`: All cars list with pagination
- **Components**:
  - `CarSearch`: License plate search with detailed car info display
  - `CarList`: Grid view of all cars with load more functionality
- **Icons**: lucide-react for modern icon system
- **Type Safety**: GraphQL Code Generator for automatic type generation

## Architecture
- **Infrastructure**: Defined in `pkgs/cdk/lib/cdk-appsync-demo-stack.ts`.
- **Schema**: GraphQL schema in `pkgs/cdk/graphql/schema.graphql`.
- **Resolvers**: 
  - `getCar.js`: Individual car retrieval (GetItem operation)
  - `listCars.js`: All cars retrieval (Scan operation with pagination)
  - `getDefects.js`: Defects for a specific car
  - `pipeline.js`: Pipeline resolver coordinator
- **Web App**: Located in `pkgs/frontend`.
- **Styling**: Custom Tailwind CSS v4 configuration with animations in `globals.css`
