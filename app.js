const express = require("express")
const apiRouter = require("./routes/api.router")
const {handlePathNotFound, handleCustomError, handleBadRequest, handleServerError} = require("./controllers/errors")
const app = express()

app.use(express.json())

app.use("/api", apiRouter)

app.all("*invalid-path", handlePathNotFound)

app.use(handleCustomError)

app.use(handleBadRequest)

app.use(handleServerError)

module.exports = app