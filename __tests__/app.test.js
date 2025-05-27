const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")

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
        test("Properties will be ordered by most favourited to least favourited by default.", () => {
            
        })
        test("User can give a maximum price for properties", async() => {
              const {body} = await request(app).get("/api/properties/?maxprice=100")

              body.properties.forEach((property) => {
                expect(property.price_per_night <= 100).toBe(true)
              })
            })
        test("User can give a minimum price for properties", async () => {
            const {body} = await request(app).get("/api/properties/?minprice=100")

              body.properties.forEach((property) => {
                expect(property.price_per_night >= 100).toBe(true)
        })
        })
        test("User can sort by price_per_night", async () => {
            const {body} = await request(app).get("/api/properties/?sort=price_per_night")

            expect(body.properties).toBeSortedBy("price_per_night")
        })
        test("User can sort by price_per_night in descending order", async () => {
            const {body} = await request(app).get("/api/properties/?sort=price_per_night&order=descending")
            
            expect(body.properties).toBeSortedBy("price_per_night", {descending: true})

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