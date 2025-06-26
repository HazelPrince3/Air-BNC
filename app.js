const express = require("express")
const apiRouter = require("./routes/api.router")
const {handlePathNotFound, handleCustomError, handleBadRequest, handleServerError} = require("./controllers/errors")
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('./public'))

app.get("/", (req, res, next) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.use("/api", apiRouter)

app.all("*invalid-path", handlePathNotFound)

app.use(handleCustomError)

app.use(handleBadRequest)

app.use(handleServerError)

module.exports = app