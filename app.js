const express = require("express")
const {getProperties} = require("./controllers/properties.controllers")
const {getPropertyReviews} = require("./controllers/reviews.controllers")
const {handlePathNotFound, handleCustomError} = require("./controllers/errors")
const app = express()

app.get("/api/properties", getProperties)

app.get("/api/properties/:id/reviews", getPropertyReviews)

app.all("*invalid-path", handlePathNotFound)

app.use(handleCustomError)

module.exports = app