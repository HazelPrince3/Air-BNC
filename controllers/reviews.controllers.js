const {selectReviewsByProperty, insertPropertyReview} = require("../models/reviews.models")
exports.getPropertyReviews = async (req, res, next) => {

    const {id} = req.params

    const reviews = await selectReviewsByProperty(id)
   
    res.status(200).send(reviews)
}

exports.postPropertyReview = async (req, res, next) => {
    const {id} = req.params
    
    const {guest_id, rating, comment} = req.body
    
    const review = await insertPropertyReview(guest_id, rating, comment, id)

    res.status(201).send({review})
}