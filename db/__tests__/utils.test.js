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
  test("Should return an array", () => {

    expect(formatUsers([])).toEqual([])
  })
  test("First element in the array should be the value of the first_name in the object", () => {
    const testUser = [
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "phone_number": "+44 7000 111111",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      }]
    const testFormattedUser = formatUsers(testUser)
    expect(testFormattedUser[0][0]).toBe("Alice")
  })
  test("Second element in the array should be the value of the surname in the object", () => {
    const testUser = [
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "phone_number": "+44 7000 111111",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      }]
    const testFormattedUser = formatUsers(testUser)
    expect(testFormattedUser[0][1]).toBe("Johnson")
  })
  test("Third element in the array should be the value of the email in the object", () => {
    const testUser = [
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "phone_number": "+44 7000 111111",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      }]
    const testFormattedUser = formatUsers(testUser)
    expect(testFormattedUser[0][2]).toBe("alice@example.com")
  })
  test("fourth element in the array should be the value of the phone_number in the object", () => {
    const testUser = [
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "phone_number": "+44 7000 111111",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      }]
    const testFormattedUser = formatUsers(testUser)
    expect(testFormattedUser[0][3]).toBe("+44 7000 111111")
  })
  test("fourth element in the array should be the value of null if no phone number is provided", () => {
    const testUser = [
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      }]
    const testFormattedUser = formatUsers(testUser)
    expect(testFormattedUser[0][3]).toBe(null)
  })
  test("fith element in the array should be a boolean of true is the role in the object is the host", () => {
    const testUser = [
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "phone_number": "+44 7000 111111",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      }]
    const testFormattedUser = formatUsers(testUser)
    expect(testFormattedUser[0][4]).toBe(true)
  })
  test("sixth element in the array should be the value of the avatar in the object", () => {
    const testUser = [
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "phone_number": "+44 7000 111111",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      }]
    const testFormattedUser = formatUsers(testUser)
    expect(testFormattedUser[0][5]).toBe("https://example.com/images/alice.jpg")
  })
  test("Should return the corrected values for multiple objects", () => {
    const testUsers =[
      {
        "first_name": "Alice",
        "surname": "Johnson",
        "email": "alice@example.com",
        "phone_number": "+44 7000 111111",
        "role": "host",
        "avatar": "https://example.com/images/alice.jpg"
      },
      {
        "first_name": "Bob",
        "surname": "Smith",
        "email": "bob@example.com",
        "phone_number": "+44 7000 222222",
        "role": "guest",
        "avatar": "https://example.com/images/bob.jpg"
      }]
    expect(formatUsers(testUsers)).toEqual([["Alice", "Johnson", "alice@example.com", "+44 7000 111111", true, "https://example.com/images/alice.jpg"], ["Bob", "Smith", "bob@example.com", "+44 7000 222222", false, "https://example.com/images/bob.jpg"]])
  })
})