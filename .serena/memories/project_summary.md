# Project Summary

This project is an AWS CDK demonstration of an AppSync API backed by DynamoDB tables.
It showcases a one-to-many relationship between "cars" and "defects".

## Key Features
- **AppSync API**: Named `carAPI`.
- **DynamoDB Tables**:
  - `cardata-cars`: Stores car information (Partition Key: `licenseplate`).
  - `cardata-defects`: Stores defect information (Partition Key: `id`).
  - `defects-by-licenseplate` GSI on `cardata-defects` to query by `licenseplate`.
- **Resolvers**: JavaScript resolvers (AppSync Functions) to fetch data and handle the nested query (cars -> defects).
- **Data Source**: Public RDW data (Netherlands vehicle registration).

## Architecture
The CDK stack (`lib/cdk-appsync-demo-stack.ts`) sets up the AppSync API, DynamoDB tables, and resolvers.
The schema is defined in `graphql/schema.graphql`.
Data population is handled by `utils/index.js`.
