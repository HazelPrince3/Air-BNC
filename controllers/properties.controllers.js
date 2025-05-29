const {selectProperties, selectSingleProperty} = require("../models/properties.models")

exports.getProperties = async (req, res, next) => {
    
    const {maxprice, minprice, sort, order, host} = req.query

        const properties = await selectProperties(maxprice, minprice, sort, order, host)
   
        res.status(200).send({properties})
}

exports.getSingleProperty = async (req, res, next) => {

    const {id} = req.params
    const {user_id} = req.query

    const property = await selectSingleProperty(id, user_id)

    res.status(200).send({property})
}

