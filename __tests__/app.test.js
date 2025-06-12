
const request = require("supertest")
const app = require("../app")
const {propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData} = require("../db/data/test")
const db = require("../db/connection")
const seed = require("../db/seed")

beforeEach(async() => {
    await seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData)
})

afterAll(async () => {
    await db.end()
})

describe("app", () => {
    test("non existent endpoint responds with stauts 404 and Path not found msg", async () => {
        const {body} = await request(app).get("/non-existent-path").expect(404);

        expect(body.msg).toBe("Path not found.");
    })
   describe("GET - /api/properties", () => {
        test("Responds with a status of 200", async () => {
            await request(app).get("/api/properties").expect(200)
    })
        test.only("Responds with an array of objects containing property_id, property_name, location, price_per_night, host, image", async() =>{
            const {body} = await request(app).get("/api/properties")

             expect(Array.isArray(body.properties)).toBe(true)

             expect(body.properties.length > 0).toBe(true)

             body.properties.forEach((property) => {
            expect(property.hasOwnProperty("property_id")).toBe(true)
            expect(property.hasOwnProperty("property_name")).toBe(true)
            expect(property.hasOwnProperty("location")).toBe(true)
            expect(property.hasOwnProperty("price_per_night")).toBe(true) 
            expect(property.hasOwnProperty("host")).toBe(true)
            expect(property.hasOwnProperty("image")).toBe(true)
        })
    })
        test("Array should have a length of 11", async() => {
             const {body} = await request(app).get("/api/properties")
             expect(body.properties.length).toBe(11)
        })
        test("Properties will be ordered by most favourited to least favourited by default.", async () => {
            const {body} = await request(app).get("/api/properties")

            expect(body.properties).toBeSortedBy("count", {descending: true, coerce: true})
        })
        test("User can give a maximum price for properties", async() => {
              const {body} = await request(app).get("/api/properties/?maxprice=100")

              body.properties.forEach((property) => {
                expect(property.price_per_night <= 100).toBe(true)
              })
            })
        test("Invalid maximum price responds with a status:400 and msg", async()=>{
            const {body} = await request(app).get("/api/properties?maxprice=invalid-maxprice").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("User can give a minimum price for properties", async () => {
            const {body} = await request(app).get("/api/properties/?minprice=100")

              body.properties.forEach((property) => {
                expect(property.price_per_night >= 100).toBe(true)
        })
        })
        test("Invalid minimum price responds with a status:400 and msg", async() => {
            const {body} = await request(app).get("/api/properties?minprice=invalid-minprice").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("User can sort by price_per_night", async () => {
            const {body} = await request(app).get("/api/properties/?sort=price_per_night")

            expect(body.properties).toBeSortedBy("price_per_night", {coerce: true})
        })
        test("User can can sort by popularity", async()=>{
            const {body} = await request(app).get("/api/properties/?sort=popularity")

            expect(body.properties).toBeSortedBy("count", {coerce: true})
        })
        test("Invalid sort responds with a status:400 and msg", async() => {
            const {body} = await request(app).get("/api/properties?sort=invalid-sort").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("User can sort by price_per_night in descending order", async () => {
            const {body} = await request(app).get("/api/properties/?sort=price_per_night&order=descending")

            expect(body.properties).toBeSortedBy("price_per_night", {descending: true, coerce: true})

        })
        test("User can sort by least favourited to most favourited", async() => {
            const {body} = await request(app).get("/api/properties/?order=ascending")

            expect(body.properties).toBeSortedBy("count", {coerce: true})
        })
        test("Invalid order responds with a status:400 and msg", async() => {
            const {body} = await request(app).get("/api/properties?order=invalid-order").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("User can specify the host id", async() => {
          const {body} = await request(app).get("/api/properties/?host=1")

            body.properties.forEach((property) => {
               expect(property.host_id).toBe(1)
        })
        })
        test("Invalid host_id responds with a status:400 and msg", async()=> {
            const {body} = await request(app).get("/api/properties?host=invalid-order").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("valid host_id but non-existent responds with a 404 and msg", async() => {
             const {body} = await request(app).get("/api/properties?host=1000000").expect(404)

            expect(body.msg).toBe("Host not found")
        })
})

    xdescribe("GET - /api/properties/:id/reviews", () => {
        test("Responds with a status of 200", async () => {
            await request(app).get("/api/properties/3/reviews").expect(200)
        })
        test("Responds with an array of objects containing review_id, comment, rating, created_at, guest, guest_avatar", async () => {
            const {body} = await request(app).get("/api/properties/1/reviews")

            expect(Array.isArray(body.reviews)).toBe(true)

            expect(body.reviews.length > 0).toBe(true)

            body.reviews.forEach((review) => {
            expect(review.hasOwnProperty("review_id")).toBe(true)
            expect(review.hasOwnProperty("comment")).toBe(true)
            expect(review.hasOwnProperty("rating")).toBe(true)
            expect(review.hasOwnProperty("created_at")).toBe(true)
            expect(review.hasOwnProperty("guest")).toBe(true)
            expect(review.hasOwnProperty("guest_avatar")).toBe(true)
            })

        })
        test("Response should have a key of average_rating with a value as the average of the ratings", async() => {
            const {body} = await request(app).get("/api/properties/1/reviews")

            expect(body.hasOwnProperty("average_rating")).toBe(true)
            expect(body.average_rating).toBe("2.50")
        })
        test("Should be ordered by most recent to least recent", async() => {
            const {body} = await request(app).get("/api/properties/1/reviews")

            expect(body.reviews).toBeSortedBy("created_at", {descending: true})
        })
        test("Invalid id responds with a status:400 and a Bad request msg", async() => {
            const {body} = await request(app).get("/api/properties/invalid-id/reviews").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("valid id but non-existent responds with a status:404 and msg:Id not found", async() => {
            const {body} = await request(app).get("/api/properties/1000000/reviews").expect(404)

            expect(body.msg).toBe("Id not found.")
        })
    })

    xdescribe("GET - /api/properties/:id", () =>{
        test("Responds with a status of 200", async() =>{
            await request(app).get("/api/properties/1").expect(200)
        })
        test("Responds with an object containing property_id, property_name, location, price_per_night, description, host, host_avatar, favourite_count", async() => {
            const {body} = await request(app).get("/api/properties/10")

            expect(body.property.hasOwnProperty("property_id")).toBe(true)
            expect(body.property.hasOwnProperty("property_name")).toBe(true)
            expect(body.property.hasOwnProperty("location")).toBe(true)
            expect(body.property.hasOwnProperty("price_per_night")).toBe(true)
            expect(body.property.hasOwnProperty("description")).toBe(true)
            expect(body.property.hasOwnProperty("host")).toBe(true)
            expect(body.property.hasOwnProperty("host_avatar")).toBe(true)
            expect(body.property.hasOwnProperty("favourite_count")).toBe(true)
        })
        test("Responds with an object containing a key of images with an a value of an array", async() => {
            const {body} = await request(app).get("/api/properties/1")

            expect(body.property.hasOwnProperty("images")).toBe(true)

            expect(body.property.images.length).toBe(3)
        })
        test("Responds with an object containing a key of amenities with a value of an array", async() => {
            const {body} = await request(app).get("/api/properties/1")

            expect(body.property.hasOwnProperty("amenities")).toBe(true)

            expect(body.property.images.length).toBe(3)
        })
        test("Invalid id responds with a status:400 and msg: Bad request", async() => {
             const {body} = await request(app).get("/api/properties/invalid-id").expect(400)

             expect(body.msg).toBe("Bad request.")
        })
        test("Valid id but non-existent responds with a status:404 and msg: Id not found", async() => {
            const {body} = await request(app).get("/api/properties/1000").expect(404)

             expect(body.msg).toBe("Property not found.")
        })
        test("User can see whether a specific user_id has favourited the property", async() => {
            const {body: trueTest} = await request(app).get("/api/properties/1?user_id=2")

            expect(trueTest.property.favourited).toBe(true)

            const {body:falseTest} = await request(app).get("/api/properties/1?user_id=1")

            expect(falseTest.property.favourited).toBe(false)
        })
        test("Invalid user_id responds with a status:400 and msg: Bad request", async() => {
            const {body} = await request(app).get("/api/properties/1?user_id=invalid-user-id").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Valid user_id but non-existent responds a status of 200 and the favourited key should have a value of false", async() => {
            const {body} = await request(app).get("/api/properties/1?user_id=10000").expect(200)

            expect(body.property.favourited).toBe(false)
        })
        
    })

    xdescribe("POST - /api/properties/:id/reviews", () => {
        test("Responds with a status of 201", async() => {
            const data = {
                guest_id: 4,
                rating: 4,
                comment: "comment about test property."
            }
            const payload = JSON.stringify(data);

            await request(app).post("/api/properties/1/reviews").set('Content-Type', 'application/json').send(payload).expect(201)
        })
        test("Responds with an object with the keys of review_id, property_id, guest_id, rating, comment, created_at", async() => {
            const data = {
                guest_id: 4,
                rating: 4,
                comment: "comment about test property."
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/1/reviews").set('Content-Type', 'application/json').send(payload)

            expect(body.review.hasOwnProperty("review_id")).toBe(true)
            expect(body.review.hasOwnProperty("property_id")).toBe(true)
            expect(body.review.hasOwnProperty("guest_id")).toBe(true)
            expect(body.review.hasOwnProperty("rating")).toBe(true)
            expect(body.review.hasOwnProperty("comment")).toBe(true)
            expect(body.review.hasOwnProperty("created_at")).toBe(true)

        })
        test("Invalid id responds with status:400 and msg: Bad request", async()=>{
             const data = {
                guest_id: 4,
                rating: 4,
                comment: "comment about test property."
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/invalid-id/reviews").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")

        })
        test("Invalid guest_id responds with status:400 and msg: Bad request.", async() => {
            const data = {
                guest_id: "invalid-id",
                rating: 4,
                comment: "comment about test property."
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/1/reviews").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Invalid rating responds with status:400 and msg: Bad request.", async() => {
            const data = {
                guest_id: 2,
                rating: "invalid-rating",
                comment: "comment about test property."
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/1/reviews").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Invalid comment responds with status:400 and msg: Bad request.", async() => {
            const data = {
                guest_id: "invalid-id",
                rating: 4,
                comment: 10
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/1/reviews").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
    })

    xdescribe("DELETE - /api/reviews/:id", () => {
        test("Responds with a status of 204", async() => {
            await request(app).delete("/api/reviews/1").expect(204)
        })
        test("testReviews should have an array of length 11 after deletion", async() => {
            await request(app).delete("/api/reviews/1")

            const {rows} = await db.query("SELECT * FROM reviews")

            expect(rows.length).toBe(10)
        })
        test("Invalid id responds with status:400 and msg: Bad request", async() => {
            const {body} = await request(app).delete("/api/reviews/invalid-id").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Valid id but non-existent review responds with a status: 404 and msg: Review not found", async() => {
            const {body} = await request(app).delete("/api/reviews/1000").expect(404)

            expect(body.msg).toBe("Review not found.")
        })
    })

    xdescribe("GET - /api/users/:id", () => {
        test("Responds with a status of 200", async() => {
            await request(app).get("/api/users/1").expect(200)
        })
        test("Responds with an user object containing the key user_id, first_name, surname, email, phone_number, avatar, created_at", async() => {
            const {body} = await request(app).get("/api/users/2")

            expect(body.user.hasOwnProperty("user_id")).toBe(true)
            expect(body.user.hasOwnProperty("first_name")).toBe(true)
            expect(body.user.hasOwnProperty("surname")).toBe(true)
            expect(body.user.hasOwnProperty("email")).toBe(true)
            expect(body.user.hasOwnProperty("phone_number")).toBe(true)
            expect(body.user.hasOwnProperty("avatar")).toBe(true)
            expect(body.user.hasOwnProperty("created_at")).toBe(true)
        })
        test("Invalid id responds with status:400 and msg: Bad request", async() => {
            const {body} = await request(app).get("/api/users/invalid-id").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Valid id but non-existent user responds with status:404 and msg User not found", async() => {
            const {body} = await request(app).get("/api/users/100").expect(404)

            expect(body.msg).toBe("User not found.")
        })
    })

    xdescribe("PATCH - /api/users/:id", () => {
        test("Responds with a status of 200", async() => {
             const data = {
                first_name: "Charlotte"
            }
            const payload = JSON.stringify(data);

            await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload).expect(200)
        })
        test("Responds with the updated object when first_name is updated", async() => {
             const data = {
                first_name: "Charlotte"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload)

            expect(body.user.first_name).toBe("Charlotte")
        })
        test("Responds with the updated object when surname and email are updated", async() => {
             const data = {
                surname: "Smith", 
                email: "smith@example.com"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload)

            expect(body.user.surname).toBe("Smith")
            expect(body.user.email).toBe("smith@example.com")
        })
        test("Responds with updated object when any combination of information is updated", async() => {
            const data = {
               phone: 111111111,
               avatar: "test-avatar.jpg"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload)

            expect(body.user.phone_number).toBe("111111111")
            expect(body.user.avatar).toBe("test-avatar.jpg")
        })
        test("Invalid id responds with a status:400 and msg:Bad request", async() => {
            const data = {
                first_name: "Charlotte"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/invalid-id").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Valid id but non-existent user responds with a status:404 and msg:User not found", async() => {
            const data = {
                first_name: "Charlotte"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1000").set('Content-Type', 'application/json').send(payload).expect(404)

            expect(body.msg).toBe("User not found.")
        })
        test("Invalid first_name responds with a status:400 and msg:Bad request", async() => {
            const data = {
                first_name: 100
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Invalid surname responds with a status:400 and msg:Bad request.", async() => {
            const data = {
                surname: 100
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Invalid phone number responds with a status:400 and msg:Bad request", async() => {
            const data = {
                phone: "invalid-number"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Invalid email responds with a status: 400 and msg: Bad request", async() => {
            const data = {
                email: "invalid-email"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Invalid avatar responds with status:400 and msg:Bad request", async() => {
            const data = {
                avatar: "invalid-avatar"
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).patch("/api/users/1").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")
        })
    })

    xdescribe("POST - /api/properties/:id/favourite", () => {
        test("Responds with a status of 201", async() => {
            const data = {
                guest_id: 2
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/1/favourite").set('Content-Type', 'application/json').send(payload).expect(201)
        })
        test("Responds with an object with the keys msg and favourite_id", async() => {
            const data = {
                guest_id: 2
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/1/favourite").set('Content-Type', 'application/json').send(payload)

            expect(body.favourite.hasOwnProperty("msg")).toBe(true)
            expect(body.favourite.msg).toBe("Property favourited successfully.")
            expect(body.favourite.hasOwnProperty("favourite_id")).toBe(true)
            expect(body.favourite.favourite_id).toBe(14)

        })
        test("Invalid property_id responds with a status:400 and msg Bad request", async() => {
            const data = {
                guest_id: 2
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/invalid-id/favourite").set('Content-Type', 'application/json').send(payload).expect(400)

            expect(body.msg).toBe("Bad request.")

        })
        test("Valid property_id but non-existent responds with a status:404 and msg Property not found", async() => {
            const data = {
                guest_id: 2
            }
            const payload = JSON.stringify(data);

            const {body} = await request(app).post("/api/properties/100/favourite").set('Content-Type', 'application/json').send(payload).expect(404)

            expect(body.msg).toBe("Property not found.")
        })
    })

    xdescribe("DELETE - /api/properties/:id/users/:id/favourite", () => {
        test("Responds with a status of 204", async() => {
            await request(app).delete("/api/properties/1/users/2/favourite").expect(204)
        })
        test("deleteFavourite should have an array length of 12 after deletion", async() =>{
            await request(app).delete("/api/properties/1/users/2/favourite")

            const {rows} = await db.query("SELECT * FROM favourites")

            expect(rows.length).toBe(12)
        })
        test("Invalid property_id responds with a status:400 and msg: Bad request.", async() => {
            const {body} = await request(app).delete("/api/properties/invalid-id/users/2/favourite").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Invalid user_id responds with a status:400 and msg: Bad request", async() => {
            const {body} = await request(app).delete("/api/properties/1/users/invalid-id/favourite").expect(400)

            expect(body.msg).toBe("Bad request.")
        })
        test("Valid id but non-existent property responds with a status:404 and msg Id not found", async() => {
            const {body} = await request(app).delete("/api/properties/100/users/1/favourite").expect(404)

            expect(body.msg).toBe("Id not found.")
        })
        test("Valid user_id but non existent user responds with a status:404 and msg: Id not found", async() => {
            const {body} = await request(app).delete("/api/properties/1/users/100/favourite").expect(404)

            expect(body.msg).toBe("Id not found.")
        })
    })
})