const seed = require("./seed");
const {propertyTypesData} = require("./data/test/");
const db = require("./connection")

seed(propertyTypesData, users).then(() =>{
    db.end()
});