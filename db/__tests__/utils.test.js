const {
  formatPropertyTypes, 
  formatUsers, 
  createUsersRef, 
  formatProperties,
  createPropertyRef,
  formatReviews,
  formatImages
  } = require("../utils/utils");

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

describe("create users ref", () => {
  test("Should return an object", () => {
    const testUsers = createUsersRef([])
    expect(typeof  testUsers === "object").toBe(true)
  })
  test("Key on reference object should be first_name and surname", () => {
    const testUsers = [
      {
        user_id: 1,
        first_name: 'Alice',
        surname: 'Johnson',
      }]
    const testFormatUsers = createUsersRef(testUsers)
    expect((testFormatUsers.hasOwnProperty("Alice Johnson"))).toBe(true)
  })
  test("value on reference object should be the value of user_id property", () => {
    const testUsers = [
      {
        user_id: 1,
        first_name: 'Alice',
        surname: 'Johnson',
      }]
    const testFormatUsers = createUsersRef(testUsers)
    expect((testFormatUsers["Alice Johnson"])).toBe(1)
  })
  test("Should create key value pairs for multiple objects", () => {
    const testUsers = [
      { user_id: 1, first_name: 'Alice', surname: 'Johnson' },
      { user_id: 2, first_name: 'Bob', surname: 'Smith' },
      { user_id: 3, first_name: 'Emma', surname: 'Davis' }]
    expect(createUsersRef(testUsers)).toEqual({"Alice Johnson": 1, "Bob Smith": 2, "Emma Davis": 3})
  })
})

describe("format properties", () => {
  test("first element in the array should be the correct user_id value", () => {
    const testProperties = [
      {
        "name": "Modern Apartment in City Center",
        "property_type": "Apartment",
        "location": "London, UK",
        "price_per_night": 120.0,
        "description": "Description of Modern Apartment in City Center.",
        "host_name": "Alice Johnson",
        "amenities": ["WiFi", "TV", "Kitchen"]
      }]
    const testUserRef = {"Alice Johnson": 1}

    const testFormatProperties = formatProperties(testProperties, testUserRef)

    expect(testFormatProperties[0][0]).toBe(1)
  })
  test("Second element in the array should be the value of the name property", () => {
    const testProperties = [
      {
        "name": "Modern Apartment in City Center",
        "property_type": "Apartment",
        "location": "London, UK",
        "price_per_night": 120.0,
        "description": "Description of Modern Apartment in City Center.",
        "host_name": "Alice Johnson",
        "amenities": ["WiFi", "TV", "Kitchen"]
      }]
    const testUserRef = {"Alice Johnson": 1}

    const testFormatProperties = formatProperties(testProperties, testUserRef)

    expect(testFormatProperties[0][1]).toBe("Modern Apartment in City Center")
  })
  test("Third element in the array should be the value of the location property", () => {
    const testProperties = [
      {
        "name": "Modern Apartment in City Center",
        "property_type": "Apartment",
        "location": "London, UK",
        "price_per_night": 120.0,
        "description": "Description of Modern Apartment in City Center.",
        "host_name": "Alice Johnson",
        "amenities": ["WiFi", "TV", "Kitchen"]
      }]
    const testUserRef = {"Alice Johnson": 1}

    const testFormatProperties = formatProperties(testProperties, testUserRef)

    expect(testFormatProperties[0][2]).toBe("London, UK")
  })
  test("Fourth element in the array should be the value of the property_type property", () => {
    const testProperties = [
      {
        "name": "Modern Apartment in City Center",
        "property_type": "Apartment",
        "location": "London, UK",
        "price_per_night": 120.0,
        "description": "Description of Modern Apartment in City Center.",
        "host_name": "Alice Johnson",
        "amenities": ["WiFi", "TV", "Kitchen"]
      }]
    const testUserRef = {"Alice Johnson": 1}

    const testFormatProperties = formatProperties(testProperties, testUserRef)

    expect(testFormatProperties[0][3]).toBe("Apartment")
  })
  test("Fifth element in the array should be the value of the price_per_night property", () => {
    const testProperties = [
      {
        "name": "Modern Apartment in City Center",
        "property_type": "Apartment",
        "location": "London, UK",
        "price_per_night": 120.0,
        "description": "Description of Modern Apartment in City Center.",
        "host_name": "Alice Johnson",
        "amenities": ["WiFi", "TV", "Kitchen"]
      }]
    const testUserRef = {"Alice Johnson": 1}

    const testFormatProperties = formatProperties(testProperties, testUserRef)

    expect(testFormatProperties[0][4]).toBe(120.0)
  })
  test("Sixth element in the array should be the value of the description property", () => {
    const testProperties = [
      {
        "name": "Modern Apartment in City Center",
        "property_type": "Apartment",
        "location": "London, UK",
        "price_per_night": 120.0,
        "description": "Description of Modern Apartment in City Center.",
        "host_name": "Alice Johnson",
        "amenities": ["WiFi", "TV", "Kitchen"]
      }]
    const testUserRef = {"Alice Johnson": 1}

    const testFormatProperties = formatProperties(testProperties, testUserRef)

    expect(testFormatProperties[0][5]).toBe("Description of Modern Apartment in City Center.")
  })
  test("Should format the correct values for multiple objects in the array", () => {
    const testProperties = [{
      "name": "Chic Studio Near the Beach",
      "property_type": "Studio",
      "location": "Brighton, UK",
      "price_per_night": 90.0,
      "description": "Description of Chic Studio Near the Beach.",
      "host_name": "Alice Johnson",
      "amenities": ["WiFi"]
    },
    {
      "name": "Elegant City Apartment",
      "property_type": "Apartment",
      "location": "Birmingham, UK",
      "price_per_night": 110.0,
      "description": "Description of Elegant City Apartment.",
      "host_name": "Emma Davis",
      "amenities": ["TV", "Kitchen", "Washer"]
    }]
    const testUserRef = {"Alice Johnson": 1, "Bob Smith": 2, "Emma Davis": 3}

    const testFormatProperties = formatProperties(testProperties, testUserRef)

    expect(testFormatProperties).toEqual([[1, "Chic Studio Near the Beach", "Brighton, UK", "Studio", 90.0, "Description of Chic Studio Near the Beach."], [3, "Elegant City Apartment", "Birmingham, UK", "Apartment", 110.0, "Description of Elegant City Apartment."]])
  })
})

describe("create properties ref", () => {
  test("Should return an object", () => {
    expect(createPropertyRef([])).toEqual({})
  })
  test("Should have the property name as a key on the object.", () => {
    const testProperties = [
      { name: 'Modern Apartment in City Center', property_id: 1 }];
    
    const testPropertyRef = createPropertyRef(testProperties)

    expect(testPropertyRef.hasOwnProperty('Modern Apartment in City Center')).toBe(true)
  })
  test("Should have a value of the correct property_id", () => {
    const testProperties = [
      { name: 'Modern Apartment in City Center', property_id: 1 }];
    
    const testPropertyRef = createPropertyRef(testProperties)

    expect(testPropertyRef['Modern Apartment in City Center']).toBe(1)
  })
  test("Should create key value pairs for multiple objects", () => {
    const testProperties = [
        { name: 'Modern Apartment in City Center', property_id: 1},
        { name: 'Cosy Family House', property_id: 2 },
        { name: 'Chic Studio Near the Beach', property_id: 3 }];
    
    const testPropertyRef = createPropertyRef(testProperties)

    expect(testPropertyRef).toEqual({'Modern Apartment in City Center': 1, 'Cosy Family House': 2, 'Chic Studio Near the Beach': 3})

  })
})

describe("format reviews", () => {
  test("First element in the array should be the correct property_id from the property reference object", () => {
    const testReview = [
      {
        "guest_name": "Frank White",
        "property_name": "Chic Studio Near the Beach",
        "rating": 4,
        "comment": "Comment about Chic Studio Near the Beach: Great location and cosy space, perfect for a beach getaway."
      }]
    const testUserRef = {"Frank White": 1}
    const testPropertyRef = {"Chic Studio Near the Beach": 1}

    const testFormatReviews = formatReviews(testReview, testUserRef, testPropertyRef)

    expect(testFormatReviews[0][0]).toBe(1)
  })
  test("Second element in the array should be the correct user_id from the user reference object", () => {
    const testReview = [
      {
        "guest_name": "Frank White",
        "property_name": "Chic Studio Near the Beach",
        "rating": 4,
        "comment": "Comment about Chic Studio Near the Beach: Great location and cosy space, perfect for a beach getaway."
      }]
    const testUserRef = {"Frank White": 1}
    const testPropertyRef = {"Chic Studio Near the Beach": 1}

    const testFormatReviews = formatReviews(testReview, testUserRef, testPropertyRef)

    expect(testFormatReviews[0][1]).toBe(1)
  })
  test("The third element in the array should be the value of the rating property", () => {
    const testReview = [
      {
        "guest_name": "Frank White",
        "property_name": "Chic Studio Near the Beach",
        "rating": 4,
        "comment": "Comment about Chic Studio Near the Beach: Great location and cosy space, perfect for a beach getaway."
      }]
    const testUserRef = {"Frank White": 1}
    const testPropertyRef = {"Chic Studio Near the Beach": 1}

    const testFormatReviews = formatReviews(testReview, testUserRef, testPropertyRef)

    expect(testFormatReviews[0][2]).toBe(4)
  })
  test("The fourth element in the array should be the value from the comment property", () => {
    const testReview = [
      {
        "guest_name": "Frank White",
        "property_name": "Chic Studio Near the Beach",
        "rating": 4,
        "comment": "Comment about Chic Studio Near the Beach: Great location and cosy space, perfect for a beach getaway."
      }]
    const testUserRef = {"Frank White": 1}
    const testPropertyRef = {"Chic Studio Near the Beach": 1}

    const testFormatReviews = formatReviews(testReview, testUserRef, testPropertyRef)

    expect(testFormatReviews[0][3]).toBe("Comment about Chic Studio Near the Beach: Great location and cosy space, perfect for a beach getaway.")
  })
  test("The fourth element should be null if no comment is provided", () => {
    const testReview = [
      {
        "guest_name": "Frank White",
        "property_name": "Chic Studio Near the Beach",
        "rating": 4
      }]
    const testUserRef = {"Frank White": 1}
    const testPropertyRef = {"Chic Studio Near the Beach": 1}

    const testFormatReviews = formatReviews(testReview, testUserRef, testPropertyRef)

    expect(testFormatReviews[0][3]).toBe(null)
  })
  test("Should format the correct values into the array for multiple objects", () => {
    const testReview = [{
      "guest_name": "Rachel Cummings",
      "property_name": "Luxury Penthouse with View",
      "rating": 5,
      "comment": "Comment about Luxury Penthouse with View: Incredible property! The view from the penthouse is stunning."
    },
    {
      "guest_name": "Frank White",
      "property_name": "Elegant City Apartment",
      "rating": 2,
      "comment": "Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable."
    }]

    const testUserRef = {"Frank White": 1, "Rachel Cummings": 2}
    const testPropertyRef = {"Luxury Penthouse with View": 1, "Elegant City Apartment": 2}

    const testFormatReviews = formatReviews(testReview, testUserRef, testPropertyRef)

    expect(testFormatReviews).toEqual([[1, 2, 5, "Comment about Luxury Penthouse with View: Incredible property! The view from the penthouse is stunning."], [2, 1, 2, "Comment about Elegant City Apartment: The apartment was nice but not as advertised. The bed was uncomfortable."]])
  })
})

describe("format images", () => {
  test("First element in the array should be the correct property_id value from the reference object", () => {
    const testImages = [
      {
        "property_name": "Modern Apartment in City Center",
        "image_url": "https://example.com/images/modern_apartment_1.jpg",
        "alt_tag": "Alt tag for Modern Apartment in City Center"
      }]
    const testPropertyRef = {'Modern Apartment in City Center': 1}

    const testFormatImages = formatImages(testImages, testPropertyRef)

    expect(testFormatImages[0][0]).toBe(1)
  })
  test("Second element should be the value of the image_url property", () => {
    const testImages = [
      {
        "property_name": "Modern Apartment in City Center",
        "image_url": "https://example.com/images/modern_apartment_1.jpg",
        "alt_tag": "Alt tag for Modern Apartment in City Center"
      }]
    const testPropertyRef = {'Modern Apartment in City Center': 1}

    const testFormatImages = formatImages(testImages, testPropertyRef)

    expect(testFormatImages[0][1]).toBe("https://example.com/images/modern_apartment_1.jpg")
  })
  test("The third element should be the value of alt_tag property", () => {
    const testImages = [
      {
        "property_name": "Modern Apartment in City Center",
        "image_url": "https://example.com/images/modern_apartment_1.jpg",
        "alt_tag": "Alt tag for Modern Apartment in City Center"
      }]
    const testPropertyRef = {'Modern Apartment in City Center': 1}

    const testFormatImages = formatImages(testImages, testPropertyRef)

    expect(testFormatImages[0][2]).toBe("Alt tag for Modern Apartment in City Center")
  })
  test("Should format the correct values into the array for multiple objects", () => {
    const testImages = [
      {
        "property_name": "Modern Apartment in City Center",
        "image_url": "https://example.com/images/modern_apartment_1.jpg",
        "alt_tag": "Alt tag for Modern Apartment in City Center"
      }, {
        "property_name": "Chic Studio Near the Beach",
        "image_url": "https://example.com/images/chic_studio_1.jpg",
        "alt_tag": "Alt tag for Chic Studio Near the Beach"
      }]
    const testPropertyRef = {'Modern Apartment in City Center': 1, "Chic Studio Near the Beach": 2}

    const testFormatImages = formatImages(testImages, testPropertyRef)

    expect(testFormatImages).toEqual([[1, "https://example.com/images/modern_apartment_1.jpg", "Alt tag for Modern Apartment in City Center"], [2, "https://example.com/images/chic_studio_1.jpg", "Alt tag for Chic Studio Near the Beach"]])
  })
})