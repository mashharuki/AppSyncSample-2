# Task Completion Checklist

When a task is completed, ensure the following:

1. **Linting & Formatting**: 
   - Run `pnpm biome format --write .` from the root to format all files.
   - Ensure no Biome errors are reported.
2. **Build**: 
   - Run `pnpm run build` to verify TypeScript compilation and build steps for all packages.
3. **Testing**: 
   - Run `pnpm test` where applicable.
4. **Verification**: 
   - If infrastructure changes were made, verify with `cdk diff` or `cdk synth` in `pkgs/cdk`.
   - If frontend changes were made, verify the dev server starts with `pnpm dev` in `pkgs/frontend`.
