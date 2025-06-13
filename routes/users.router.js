const express = require("express")
const {getUserData, patchUserInformation} = require("../controllers/users.controllers")
const usersRouter = express.Router()

usersRouter.route("/:id").get(getUserData).patch(patchUserInformation)

module.exports = usersRouter