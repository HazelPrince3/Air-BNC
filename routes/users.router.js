const express = require("express")
const {getUserData, patchUserInformation} = require("../controllers/users.controllers")
const {handleInvalidMethod} = require("../controllers/errors")
const usersRouter = express.Router()

usersRouter.route("/:id").get(getUserData).patch(patchUserInformation).all(handleInvalidMethod)

module.exports = usersRouter