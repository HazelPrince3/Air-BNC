const {selectUserById, updateUserInformation} = require("../models/users.models")

exports.getUserData = async(req, res, next) => {

    const {id} = req.params

    const user = await selectUserById(id)

    res.status(200).send({user})
}

exports.patchUserInformation = async(req, res, next) => {
    
    const {id} = req.params

    const{first_name, surname, email, phone, avatar} = req.body
    
    const user = await updateUserInformation(id, first_name, surname, email, phone, avatar)
    
    res.status(200).send({user})
}