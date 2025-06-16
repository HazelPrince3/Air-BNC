const express = require("express")
const {deletePropertyReview} = require("../controllers/reviews.controllers")
const {handleInvalidMethod} = require("../controllers/errors")

const reviewsRouter = express.Router()

reviewsRouter.route("/:id").delete(deletePropertyReview).all(handleInvalidMethod)

module.exports = reviewsRouter