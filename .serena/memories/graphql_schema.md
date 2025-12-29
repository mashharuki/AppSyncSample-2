# GraphQL Schema & API

## Schema Location
`pkgs/cdk/graphql/schema.graphql`

## Types

### Car
Represents a vehicle with the following fields:
- `licenseplate: String!` (primary key)
- `brand: String!`
- `tradename: String`
- `expirydateapk: String`
- `firstcolor: String!`
- `cylindercount: String`
- `cylindervolume: String`
- `firstregistrationdate: String`
- `catalogprice: String`
- `length: String`
- `width: String`
- `defects: [Defect]` (nested relationship)

### Defect
Represents a vehicle defect:
- `licenseplate: String!`
- `defectstartdate: String`
- `defectdescription: String`

### CarsConnection
Pagination wrapper for list queries:
- `items: [Car]` (array of cars)
- `nextToken: String` (pagination token)

## Queries

### getCar
```graphql
getCar(licenseplate: String!): Car
```
- **Purpose**: Get individual car by license plate
- **Resolver**: `getCar.js` (DynamoDB GetItem)
- **Returns**: Single car with nested defects

### listCars
```graphql
listCars(limit: Int, nextToken: String): CarsConnection
```
- **Purpose**: Get all cars with pagination
- **Resolver**: `listCars.js` (DynamoDB Scan)
- **Default limit**: 20 items
- **Returns**: CarsConnection with items and nextToken

## Resolvers

### Location
`pkgs/cdk/resolvers/`

### Resolver Files
1. **getCar.js**: Individual car retrieval using DynamoDB GetItem
2. **listCars.js**: All cars retrieval using DynamoDB Scan with pagination
3. **getDefects.js**: Fetch defects for a car using GSI
4. **pipeline.js**: Pipeline resolver for coordinating multiple operations

### DynamoDB Operations
- **GetItem**: Used for `getCar` (by primary key)
- **Scan**: Used for `listCars` (all items with pagination)
- **Query**: Used for `getDefects` (via GSI: defect-by-licenseplate)

## Frontend Integration

### Queries Location
`pkgs/frontend/lib/graphql/queries.ts`

### Available Queries
```typescript
// Individual car
export const GET_CAR = /* GraphQL */ `
  query GetCar($licenseplate: String!) { ... }
`;

// All cars
export const LIST_CARS = /* GraphQL */ `
  query ListCars($limit: Int, $nextToken: String) { ... }
`;
```

### Type Generation
- **Command**: `pnpm codegen` (in frontend directory)
- **Config**: `codegen.ts`
- **Output**: `lib/graphql/generated.ts`
- **Source**: Reads schema from `../cdk/graphql/schema.graphql`

### Generated Types
- `GetCarQuery`
- `ListCarsQuery`
- `Car` type
- `Defect` type
- `CarsConnection` type

## Best Practices
1. Always run `pnpm codegen` after schema changes
2. Use pagination for list queries (don't fetch all at once)
3. Filter null items from results before processing
4. Handle errors from GraphQL responses
5. Use proper TypeScript types from generated file
