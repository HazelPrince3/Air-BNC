const express = require("express")
const {getProperties, getSingleProperty} = require("../controllers/properties.controllers")
const {getPropertyReviews, postPropertyReview, deletePropertyReview} = require("../controllers/reviews.controllers")
const {postFavourite, deleteFavourite} = require("../controllers/favourites.controllers")

const propertiesRouter = express.Router()

propertiesRouter.get("/", getProperties)

propertiesRouter.route("/:id/reviews").get(getPropertyReviews).post(postPropertyReview)

propertiesRouter.get("/:id", getSingleProperty)

propertiesRouter.post("/:id/favourite", postFavourite)

propertiesRouter.delete("/:id/users/:user_id/favourite", deleteFavourite)

module.exports = propertiesRouter