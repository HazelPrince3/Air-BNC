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
const {propertyTypes, users, properties, reviews, images, favourites, amenities, properties_amenities, bookings} = require("./create-table-string")

async function seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData) {

    await dropTables()

    await db.query(propertyTypes);
 
    await db.query(
        format(
            `INSERT INTO property_types (property_type, description) VALUES %L`, 
            formatPropertyTypes(propertyTypesData))
        );

    await db.query(users);

    const {rows: insertedUsers} = await db.query(
        format(
             `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING user_id, first_name, surname`, formatUsers(usersData))
         );

    await db.query(properties)
    
    const usersRef = createUsersRef(insertedUsers);

    const {rows: insertedProperties} = await db.query(format(`INSERT INTO properties(host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING name, property_id`, formatProperties(propertiesData, usersRef))
    );

    await db.query(reviews)

    const propertyRef = createPropertyRef(insertedProperties)

    await db.query(format(`INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES %L`, formatReviews(reviewsData, usersRef, propertyRef))
    );
    
    await db.query(images)

    await db.query(format(`INSERT INTO images (property_id, image_url, alt_text) VALUES %L`, formatImages(imagesData, propertyRef))
    );

    await db.query(favourites)

    await db.query(format(`INSERT INTO favourites (guest_id, property_id) VALUES %L`, formatFavourites(favouritesData, usersRef, propertyRef)));

    await db.query(amenities)
    
    await db.query(format(`INSERT INTO amenities (amenity) VALUES %L `, getAmenities(propertiesData)))

    await db.query(properties_amenities)

    await db.query(format(`INSERT INTO properties_amenities (property_id, amenity_slug) VALUES %L`, formatPropertiesAmenities(propertiesData, propertyRef)))

    await db.query(bookings)
}

module.exports = seed;