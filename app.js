const express = require("express")
const {getProperties, getSingleProperty} = require("./controllers/properties.controllers")
const {getPropertyReviews} = require("./controllers/reviews.controllers")
const {handlePathNotFound, handleCustomError, handleBadRequest, handleServerError} = require("./controllers/errors")
const app = express()

app.get("/api/properties", getProperties)

app.get("/api/properties/:id/reviews", getPropertyReviews)

app.get("/api/properties/:id", getSingleProperty)

app.all("*invalid-path", handlePathNotFound)

app.use(handleCustomError)
app.use(handleBadRequest)
app.use(handleServerError)
module.exports = app