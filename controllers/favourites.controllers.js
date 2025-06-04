const {insertFavourite, deletePropertyFavourite} = require("../models/favourites.models")

exports.postFavourite = async(req, res, next) => {

    const {id} = req.params

    const{guest_id} = req.body

    const favourite = await insertFavourite(id, guest_id)

    res.status(201).send({favourite})
}

exports.deleteFavourite = async(req, res, next) => {

    const {id, user_id} = req.params

    await deletePropertyFavourite(id, user_id)

    res.status(204).send()
}