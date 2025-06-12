const seed = require("./seed");
const {propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData} = require("./data/dev");
const db = require("./connection")

seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData).then(() =>{
    db.end()
});