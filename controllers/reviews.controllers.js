const {selectReviewsByProperty} = require("../models/reviews.models")
exports.getPropertyReviews = async (req, res, next) => {

    const {id} = req.params

    const reviews = await selectReviewsByProperty(id)
   
    res.status(200).send(reviews)
}