const db = require("./connection");
const format = require("pg-format")
const formatPropertyTypes = require("./utils/utils")

async function seed(propertyTypesData, users) {

    await db.query(`DROP TABLE IF EXISTS users;`)
    await db.query(`DROP TABLE IF EXISTS property_types;`)


    await db.query(`CREATE TABLE property_types(
                    property_type VARCHAR(100) PRIMARY KEY,
                    description TEXT
                    );`);
 
    await db.query(
        format(
            `INSERT INTO property_types (property_type, description) VALUES %L`, 
            formatPropertyTypes(propertyTypesData))
        );
    
   
}

module.exports = seed;