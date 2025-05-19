const db = require("./connection");
const format = require("pg-format")
const {
    formatPropertyTypes, 
    formatUsers, 
    createUsersRef, 
    formatProperties, 
    createPropertyRef, 
    formatReviews,
    formatImages,
    formatFavourites,
    getAmenities,
    formatPropertiesAmenities
    } = require("./utils/utils")
const dropTables = require("./drop-tables")

async function seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData) {

    await dropTables()

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

    const {rows: insertedUsers} = await db.query(
        format(
             `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING user_id, first_name, surname`, formatUsers(usersData))
         );

    await db.query(`CREATE TABLE properties (
                    property_id SERIAL PRIMARY KEY,
                    host_id INT NOT NULL REFERENCES users(user_id),
                    name VARCHAR NOT NULL, 
                    location VARCHAR NOT NULL,
                    property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
                    price_per_night DECIMAL NOT NULL,
                    description TEXT
                   )`)
    
    const usersRef = createUsersRef(insertedUsers);

    const {rows: insertedProperties} = await db.query(format(`INSERT INTO properties(host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING name, property_id`, formatProperties(propertiesData, usersRef))
    );

    await db.query(`CREATE TABLE reviews (
                    review_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    rating INT NOT NULL,
                    comment TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                 )`)
    const propertyRef = createPropertyRef(insertedProperties)

    await db.query(format(`INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES %L`, formatReviews(reviewsData, usersRef, propertyRef))
    );
    
    await db.query(`CREATE TABLE images (
                    image_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    image_url VARCHAR NOT NULL,
                    alt_text VARCHAR NOT NULL
                    )`)
    await db.query(format(`INSERT INTO images (property_id, image_url, alt_text) VALUES %L`, formatImages(imagesData, propertyRef))
    );

    await db.query(`CREATE TABLE favourites (
                    favourite_id SERIAL PRIMARY KEY,
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    property_id INT NOT NULL REFERENCES properties(property_id)
                    )`)

    await db.query(format(`INSERT INTO favourites (guest_id, property_id) VALUES %L`, formatFavourites(favouritesData, usersRef, propertyRef)));

    await db.query(`CREATE TABLE amenities (
                   amenity VARCHAR PRIMARY KEY)`)
    
    await db.query(format(`INSERT INTO amenities (amenity) VALUES %L `, getAmenities(propertiesData)))

    await db.query(`CREATE TABLE properties_amenities (
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    amenity_slug VARCHAR NOT NULL REFERENCES amenities(amenity))`)

    await db.query(format(`INSERT INTO properties_amenities (property_id, amenity_slug) VALUES %L`, formatPropertiesAmenities(propertiesData, propertyRef)))

    await db.query(`CREATE TABLE bookings (
                    booking_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    check_in_date DATE NOT NULL,
                    check_out_date DATE NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW()
                    )`)
}

module.exports = seed;