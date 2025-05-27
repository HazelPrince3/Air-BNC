const express = require("express")
const {getProperties, getPropertyReviews} = require("./controllers/properties.controllers")
const {handlePathNotFound} = require("./controllers/errors")
const app = express()

app.get("/api/properties", getProperties)

app.get("/api/properties/:id/reviews", getPropertyReviews)

app.all("*invalid-path", handlePathNotFound)


module.exports = app