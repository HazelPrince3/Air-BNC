
exports.handlePathNotFound = (req, res, next) =>{
    res.status(404).send({msg: "Path not found."})}

exports.handleInvalidMethod = (req, res, next) => {
    res.status(405).send({msg: "Invalid method."})
}

exports.handleCustomError = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else {next(err)}
   
}
exports.handleBadRequest = (err, req, res, next) => {
    res.status(400).send({msg: "Bad request."})
    next(err)
}
exports.handleServerError = (err, req, res, next) => {
    
    res.status(500).send({msg: "Internal Server Error."})
}