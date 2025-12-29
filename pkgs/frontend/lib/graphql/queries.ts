export const GET_CAR = /* GraphQL */ `
  query GetCar($licenseplate: String!) {
    getCar(licenseplate: $licenseplate) {
      licenseplate
      brand
      tradename
      expirydateapk
      firstcolor
      cylindercount
      cylindervolume
      firstregistrationdate
      catalogprice
      length
      width
      defects {
        licenseplate
        defectstartdate
        defectdescription
      }
    }
  }
`;

export const LIST_CARS = /* GraphQL */ `
  query ListCars($limit: Int, $nextToken: String) {
    listCars(limit: $limit, nextToken: $nextToken) {
      items {
        licenseplate
        brand
        tradename
        expirydateapk
        firstcolor
        cylindercount
        cylindervolume
        firstregistrationdate
        catalogprice
        length
        width
      }
      nextToken
    }
  }
`;
