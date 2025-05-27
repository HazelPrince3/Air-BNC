const {selectProperties, selectReviewsByProperty} = require("../models/properties.models")

exports.getProperties = async (req, res, next) => {
    
    const {maxprice, minprice, sort, order} = req.query
    
    const properties = await selectProperties(maxprice, minprice, sort, order)
   
    res.status(200).send({properties})
}

exports.getPropertyReviews = async (req, res, next) => {

    const {id} = req.params

    const reviews = await selectReviewsByProperty(id)

    res.status(200).send({reviews})
}