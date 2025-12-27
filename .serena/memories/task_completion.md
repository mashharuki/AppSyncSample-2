# Task Completion Checklist

When a task is completed, ensure the following:

1. **Linting & Formatting**: Run `pnpm run format` to ensure code adheres to Biome standards.
2. **Build**: Run `pnpm run build` to verify TypeScript compilation succeeds.
3. **Testing**: Run `pnpm test` if applicable (though tests might be minimal currently).
4. **Verification**: If infrastructure changes were made, verify with `cdk diff` or `cdk synth`.
