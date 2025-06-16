const express = require("express")
const {getProperties, getSingleProperty} = require("../controllers/properties.controllers")
const {getPropertyReviews, postPropertyReview} = require("../controllers/reviews.controllers")
const {postFavourite, deleteFavourite} = require("../controllers/favourites.controllers")
const {handleInvalidMethod} = require("../controllers/errors")

const propertiesRouter = express.Router()

propertiesRouter.route("/").get(getProperties).all(handleInvalidMethod)

propertiesRouter.route("/:id/reviews").get(getPropertyReviews).post(postPropertyReview).all(handleInvalidMethod)

propertiesRouter.route("/:id").get(getSingleProperty).all(handleInvalidMethod)

propertiesRouter.route("/:id/favourite").post(postFavourite).all(handleInvalidMethod)

propertiesRouter.route("/:id/users/:user_id/favourite").delete(deleteFavourite).all(handleInvalidMethod)

module.exports = propertiesRouter