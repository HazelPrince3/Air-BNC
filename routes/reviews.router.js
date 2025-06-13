const express = require("express")
const {deletePropertyReview} = require("../controllers/reviews.controllers")

const reviewsRouter = express.Router()

reviewsRouter.delete("/:id", deletePropertyReview)

module.exports = reviewsRouter