const {formatPropertyTypes, formatUsers} = require("../utils/utils");

describe("format property types", () => {
    test("Should return an array", () => {
        expect(formatPropertyTypes([])).toEqual([])
    })
    test("First element in the nested array should be the value from the first key", () => {
        const testPropertyTypes = [
            {
              "property_type": "Apartment",
              "description": "Description of Apartment."
            }]
        const testFormatData = formatPropertyTypes(testPropertyTypes)

        expect(testFormatData[0][0]).toBe("Apartment")
    })
    test("Second element in the nested array should be the value from the second key", () => {
        const testPropertyTypes = [
            {
              "property_type": "Apartment",
              "description": "Description of Apartment."
            }]
        const testFormatData = formatPropertyTypes(testPropertyTypes)

        expect(testFormatData[0][1]).toBe("Description of Apartment.")
    })
    test("Should return the two values for multiple objects in an array", () => {
        const testPropertyTypes = [
            {
              "property_type": "Apartment",
              "description": "Description of Apartment."
            },
            {
              "property_type": "House",
              "description": "Description of House."
            },
            {
              "property_type": "Studio",
              "description": "Description of Studio."
            }
          ]
          const testFormatData = formatPropertyTypes(testPropertyTypes)

          expect(testFormatData).toEqual([["Apartment", "Description of Apartment."], ["House", "Description of House."], ["Studio", "Description of Studio."]])
    })
})

describe("format users", () => {
  test("Shou")
})