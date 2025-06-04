const propertyTypes = `CREATE TABLE property_types(
                       property_type VARCHAR(100) PRIMARY KEY,
                       description TEXT
                       );`

const users = `CREATE TABLE users (
               user_id SERIAL PRIMARY KEY,
               first_name VARCHAR NOT NULL,
               surname VARCHAR NOT NULL,
               email VARCHAR NOT NULL,
               phone_number VARCHAR,
               is_host BOOLEAN NOT NULL, 
               avatar VARCHAR,
               created_at TIMESTAMP DEFAULT NOW());`

const properties = `CREATE TABLE properties (
                    property_id SERIAL PRIMARY KEY,
                    host_id INT NOT NULL REFERENCES users(user_id),
                    name VARCHAR NOT NULL, 
                    location VARCHAR NOT NULL,
                    property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
                    price_per_night DECIMAL NOT NULL,
                    description TEXT
                    );`

const reviews = `CREATE TABLE reviews (
                 review_id SERIAL PRIMARY KEY,
                 property_id INT NOT NULL REFERENCES properties(property_id),
                 guest_id INT NOT NULL REFERENCES users(user_id),
                 rating INT NOT NULL,
                 comment TEXT,
                 created_at TIMESTAMP DEFAULT NOW()
                 );`

const images = `CREATE TABLE images (
                image_id SERIAL PRIMARY KEY,
                property_id INT NOT NULL REFERENCES properties(property_id),
                image_url VARCHAR NOT NULL,
                alt_text VARCHAR NOT NULL
                )`
const favourites = `CREATE TABLE favourites (
                    favourite_id SERIAL PRIMARY KEY,
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    property_id INT NOT NULL REFERENCES properties(property_id)
                    );`

const amenities = `CREATE TABLE amenities (
                   amenity VARCHAR PRIMARY KEY);`

const properties_amenities = `CREATE TABLE properties_amenities (
                              property_id INT NOT NULL REFERENCES properties(property_id),
                              amenity_slug VARCHAR NOT NULL REFERENCES amenities(amenity));`

const bookings = `CREATE TABLE bookings (
                  booking_id SERIAL PRIMARY KEY,
                  property_id INT NOT NULL REFERENCES properties(property_id),
                  guest_id INT NOT NULL REFERENCES users(user_id),
                  check_in_date DATE NOT NULL,
                  check_out_date DATE NOT NULL,
                  created_at TIMESTAMP DEFAULT NOW()
                  )`

module.exports = {propertyTypes: propertyTypes, users:users, properties: properties, reviews: reviews, images: images, favourites:favourites, amenities: amenities, properties_amenities: properties_amenities, bookings: bookings}