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
   xdescribe("GET - /api/properties", () => {
        test("Responds with a status of 200", async () => {
            await request(app).get("/api/properties").expect(200)
    })
        test("Responds with an array of objects containing property_id, property_name, location, price_per_night, host", async() =>{
            const {body} = await request(app).get("/api/properties")

             expect(Array.isArray(body.properties)).toBe(true)

             expect(body.properties.length > 0).toBe(true)

             body.properties.forEach((property) => {
            expect(property.hasOwnProperty("property_id")).toBe(true)
            expect(property.hasOwnProperty("property_name")).toBe(true)
            expect(property.hasOwnProperty("location")).toBe(true)
            expect(property.hasOwnProperty("price_per_night")).toBe(true) 
            expect(property.hasOwnProperty("host")).toBe(true)
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

    describe("POST - /api/properties/:id/reviews", () => {
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

    
})