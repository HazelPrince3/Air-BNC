const express = require("express")
const {getProperties, getSingleProperty} = require("./controllers/properties.controllers")
const {getPropertyReviews, postPropertyReview, deletePropertyReview} = require("./controllers/reviews.controllers")
const {getUserData, patchUserInformation} = require("./controllers/users.controllers")
const {postFavourite, deleteFavourite} = require("./controllers/favourites.controllers")
const {handlePathNotFound, handleCustomError, handleBadRequest, handleServerError} = require("./controllers/errors")
const app = express()

app.get("/api/properties", getProperties)

app.get("/api/properties/:id/reviews", getPropertyReviews)

app.get("/api/properties/:id", getSingleProperty)

app.use(express.json())

app.post("/api/properties/:id/reviews", postPropertyReview)

app.delete("/api/reviews/:id", deletePropertyReview)

app.get("/api/users/:id", getUserData)

app.patch("/api/users/:id", patchUserInformation)

app.post("/api/properties/:id/favourite", postFavourite)

app.delete("/api/properties/:id/users/:user_id/favourite", deleteFavourite)

app.all("*invalid-path", handlePathNotFound)

app.use(handleCustomError)
app.use(handleBadRequest)
app.use(handleServerError)
module.exports = app