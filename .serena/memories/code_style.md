# Code Style and Conventions

- **Formatter/Linter**: Biome is the source of truth for formatting and linting.
  - Run `pnpm run format` to automatically fix issues.
  - Configuration is in `biome.json`.
- **TypeScript**: Strict mode is enabled (`"strict": true` in `tsconfig.json`).
- **Imports**: Use `node:` protocol for Node.js built-in modules (e.g., `import path = require("node:path")`).
- **CDK Constructs**: Follow standard CDK patterns. Stack is defined in `lib/`.
- **Resolvers**: Written in JavaScript, located in `resolvers/`.
