const seed = require("./seed");
const {propertyTypesData, usersData, propertiesData, reviewsData} = require("./data/test/");
const db = require("./connection")

seed(propertyTypesData, usersData, propertiesData, reviewsData).then(() =>{
    db.end()
});