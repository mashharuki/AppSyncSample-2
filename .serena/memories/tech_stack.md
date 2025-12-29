# Tech Stack

## Core
- **Monorepo Management**: pnpm workspaces
- **Linting/Formatting**: Biome (configured at root and package levels)

## Backend (pkgs/cdk)
- **Language**: TypeScript (Infrastructure), JavaScript (Resolvers)
- **Framework**: AWS CDK (Cloud Development Kit)
- **Cloud Services**: AWS AppSync, AWS DynamoDB
- **Runtime**: Node.js
- **Build**: TypeScript compiler with custom tsconfig

## Frontend (pkgs/frontend)
- **Framework**: Next.js 16 (with Turbopack)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: lucide-react (v0.562.0)
- **GraphQL Client**: AWS Amplify GraphQL client
- **Code Generation**: GraphQL Code Generator
  - Generates TypeScript types from GraphQL schema
  - Command: `pnpm codegen`
- **Fonts**: Geist Sans & Geist Mono

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
