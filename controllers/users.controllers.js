const {selectUserById} = require("../models/users.models")

exports.getUserData = async(req, res, next) => {

    const {id} = req.params

    const user = await selectUserById(id)

    res.status(200).send({user})
}