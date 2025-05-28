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
    test("non existent endpoint responds with stauts 404 and msg", async () => {
        const {body} = await request(app).get("/non-existent-path").expect(404);

        expect(body.msg).toBe("Path not found.");
    })
    describe("GET - /api/properties", () => {
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
        test.only("valid host_id but non-existent responds with a 404 and msg", async() => {
             const {body} = await request(app).get("/api/properties?host=1000000").expect(404)

            expect(body.msg).toBe("Host not found")
        })
})



    xdescribe("GET - /api/properties/:id/reviews", () => {
        test("Responds with a status of 200", async () => {
            await request(app).get("/api/properties/:id/reviews").expect(200)
        })
        test("Responds with an array of objects containing review_id, comment, rating, created_at, guest, guest_avatar", async () => {
            const {body} = await request(app).get("/api/properties/1/reviews")

            expect(Array.isArray(body.reviews)).toBe(true)

            expect(body.properties.length > 0).toBe(true)

            body.reviews.forEach((review) => {
            expect(review.hasOwnProperty("review_id")).toBe(true)
            expect(review.hasOwnProperty("comment")).toBe(true)
            expect(review.hasOwnProperty("rating")).toBe(true)
            expect(review.hasOwnProperty("created_at")).toBe(true)
            expect(review.hasOwnProperty("guest")).toBe(true)
            expect(review.hasOwnProperty("guest_avatar")).toBe(true)
            })

        })
    })
})