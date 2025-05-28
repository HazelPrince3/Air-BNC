exports.handlePathNotFound = (req, res, next) =>{
    res.status(404).send({msg: "Path not found."})}

exports.handleCustomError = (err, req, res, next) => {
    res.status(err.status).send({msg: err.msg})
}