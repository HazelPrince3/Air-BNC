const express = require("express")
const {getProperties, getSingleProperty} = require("./controllers/properties.controllers")
const {getPropertyReviews, postPropertyReview, deletePropertyReview} = require("./controllers/reviews.controllers")
const {getUserData} = require("./controllers/users.controllers")
const {handlePathNotFound, handleCustomError, handleBadRequest, handleServerError} = require("./controllers/errors")
const app = express()

app.get("/api/properties", getProperties)

app.get("/api/properties/:id/reviews", getPropertyReviews)

app.get("/api/properties/:id", getSingleProperty)

app.use(express.json())

app.post("/api/properties/:id/reviews", postPropertyReview)

app.delete("/api/reviews/:id", deletePropertyReview)

app.get("/api/users/:id", getUserData)

app.all("*invalid-path", handlePathNotFound)

app.use(handleCustomError)
app.use(handleBadRequest)
app.use(handleServerError)
module.exports = app