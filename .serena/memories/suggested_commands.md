# Suggested Commands

## Development
- `pnpm install`: Install dependencies.
- `pnpm run build`: Compile TypeScript.
- `pnpm run watch`: Watch for changes and compile.
- `pnpm run lint`: Check code for linting errors using Biome.
- `pnpm run format`: Fix linting and formatting errors using Biome.

## Deployment
- `cdk deploy`: Deploy the stack to AWS.
- `cdk destroy`: Remove the stack from AWS.
- `cdk diff`: Compare deployed stack with current state.
- `cdk synth`: Synthesize CloudFormation template.

## Data Management
- `pnpm run push-data`: Populate DynamoDB tables with sample data (requires deployed stack).

## Testing
- `pnpm test`: Run Jest tests.
