const seed = require("./seed");
const {propertyTypesData, usersData} = require("./data/test/");
const db = require("./connection")

seed(propertyTypesData, usersData).then(() =>{
    db.end()
});