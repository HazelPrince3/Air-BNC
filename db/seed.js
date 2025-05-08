const db = require("./connection");
const format = require("pg-format")
const {formatPropertyTypes, formatUsers} = require("./utils/utils")

async function seed(propertyTypesData, usersData) {

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

    await db.query(`CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        surname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone_number VARCHAR,
        is_host BOOLEAN NOT NULL, 
        avatar VARCHAR,
        create_at TIMESTAMP DEFAULT NOW());`);

    await db.query(
        format(
             `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L`, formatUsers(usersData))
         );
}

module.exports = seed;