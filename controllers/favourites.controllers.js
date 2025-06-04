const {insertFavourite} = require("../models/favourites.models")

exports.postFavourite = async(req, res, next) => {

    const {id} = req.params

    const{guest_id} = req.body

    const favourite = await insertFavourite(id, guest_id)

    res.status(201).send({favourite})
}