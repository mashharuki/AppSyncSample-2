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
- **Authentication**: AWS Cognito User Pool for user authentication
  - Email-based sign-up/sign-in
  - Self-registration enabled with email verification
  - Password policy: min 8 chars, uppercase, lowercase, numbers required
  - Token validity: Access/ID (1h), Refresh (30 days)
- **Authorization**: AppSync with Cognito User Pool authentication (default)
  - Additional auth modes: API_KEY, IAM (for backward compatibility)
- One-to-many relationship between "cars" and "defects".
- Public RDW data source.
- **GraphQL Queries**:
  - `getCar(licenseplate: String!)`: Get individual car by license plate
  - `listCars(limit: Int, nextToken: String)`: Get all cars with pagination support
- **Pagination**: Uses DynamoDB Scan with nextToken for efficient data retrieval

### Frontend
- **Authentication**:
  - Cognito-powered user authentication with Amplify UI
  - Sign-up, sign-in, password reset, email verification
  - Japanese-localized auth forms
  - Protected routes with authentication guards
  - Global auth state management via React Context
- **Modern UI Design**: 
  - Glass morphism effects with backdrop blur
  - Animated gradients and floating elements
  - Dark theme with blue/purple accents
  - Smooth transitions and hover effects
- **Pages**:
  - `/auth`: Authentication page (sign-up/sign-in)
  - `/`: Home page with car search by license plate (protected)
  - `/cars`: All cars list with pagination (protected)
- **Components**:
  - `Header`: Navigation with user info display and logout
  - `ProtectedRoute`: Route guard for authenticated access
  - `CarSearch`: License plate search with detailed car info display
  - `CarList`: Grid view of all cars with load more functionality
- **Icons**: lucide-react for modern icon system
- **Type Safety**: GraphQL Code Generator for automatic type generation

## Architecture
- **Infrastructure**: Defined in `pkgs/cdk/lib/cdk-appsync-demo-stack.ts`.
  - Cognito User Pool & User Pool Client
  - AppSync API with Cognito authentication
  - DynamoDB tables for data storage
- **Schema**: GraphQL schema in `pkgs/cdk/graphql/schema.graphql`.
- **Resolvers**: 
  - `getCar.js`: Individual car retrieval (GetItem operation)
  - `listCars.js`: All cars retrieval (Scan operation with pagination)
  - `getDefects.js`: Defects for a specific car
  - `pipeline.js`: Pipeline resolver coordinator
- **Web App**: Located in `pkgs/frontend`.
  - `context/`: Authentication context (AuthContext)
  - `lib/`: Amplify configuration, GraphQL client
  - `app/`: Pages and components
  - `middleware.ts`: Route protection middleware
- **Styling**: Custom Tailwind CSS v4 configuration with animations in `globals.css`
