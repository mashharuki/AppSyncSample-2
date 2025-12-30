# Tech Stack

## Core
- **Monorepo Management**: pnpm workspaces
- **Linting/Formatting**: Biome (configured at root and package levels)

## Backend (pkgs/cdk)
- **Language**: TypeScript (Infrastructure), JavaScript (Resolvers)
- **Framework**: AWS CDK (Cloud Development Kit)
- **Cloud Services**: 
  - AWS AppSync (GraphQL API)
  - AWS DynamoDB (Data storage)
  - AWS Cognito (User authentication)
    - User Pool for user management
    - User Pool Client for web application
- **Runtime**: Node.js
- **Build**: TypeScript compiler with custom tsconfig

## Frontend (pkgs/frontend)
- **Framework**: Next.js 16 (with Turbopack)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: lucide-react (v0.562.0)
- **Authentication**: 
  - AWS Amplify (v6.15.9) - Auth SDK
  - @aws-amplify/ui-react (v6.13.2) - Pre-built auth components
  - React Context API for global auth state
- **GraphQL Client**: AWS Amplify GraphQL client
  - Automatic Cognito token injection
  - User Pool authentication mode
- **Code Generation**: GraphQL Code Generator
  - Generates TypeScript types from GraphQL schema
  - Command: `pnpm codegen`
- **Fonts**: Geist Sans & Geist Mono
- **Route Protection**: Next.js middleware + client-side guards

## Development Tools
- **GraphQL**: Schema-first development with code generation
- **Type Safety**: Full TypeScript coverage across frontend and backend

## Testing
- **Backend**: Jest

## Design System
- **Color Scheme**: Dark theme with blue/purple gradients
- **Effects**: Glass morphism, backdrop blur, animations
- **Animations**: Custom keyframes for shimmer, float, and glow effects
- **Typography**: Custom font variables with Geist fonts
