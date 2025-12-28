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
