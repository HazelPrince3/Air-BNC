const express = require("express")
const propertiesRouter = require("../routes/properties.router")
const usersRouter = require("../routes/users.router")
const reviewsRouter = require("../routes/reviews.router")

const apiRouter = express.Router()

apiRouter.use("/properties", propertiesRouter)

apiRouter.use("/users", usersRouter)


apiRouter.use("/reviews", reviewsRouter)





module.exports = apiRouter