const db = require("../db/connection");

exports.selectProperties = async(maxprice, minprice, sort, order) => {

    let queryValues = []

    let queryStr = `SELECT properties.property_id, name, location, price_per_night, first_name, surname, COUNT(favourites.property_id)
                    FROM properties
                    JOIN users
                    ON users.user_id = properties.host_id
                    JOIN favourites
                    ON favourites.property_id = properties.property_id`

    if(sort === "price_per_night"){
        queryStr = `SELECT properties.property_id, name, location, price_per_night, first_name, surname
                    FROM properties
                    JOIN users
                    ON users.user_id = properties.host_id`
    }

    if(maxprice > 0 && maxprice < 100000000000){
        queryValues.push(maxprice)
        queryStr += ` WHERE price_per_night <= $1`
    }
    if(minprice > 0 && minprice < 100000000000){
        if(queryValues.length){
            queryStr += ` AND`
        } else { queryStr += ` WHERE`}
        queryValues.push(minprice)
        queryStr += ` price_per_night >= $${queryValues.length}`
    }

    let groupBy = ` GROUP BY properties.property_id, name, location, price_per_night, first_name, surname`

    let sortBy = ` ORDER BY COUNT(favourites.property_id) DESC;`

    if(order === "ascending"){
        sortBy = ` ORDER BY COUNT(favourites.property_id) ASC;` 
    }
    
    if(sort === "price_per_night"){
        if(order === "descending"){
            queryStr += ` ORDER BY price_per_night DESC;`
        } else{queryStr += ` ORDER BY price_per_night;`}
    } else {queryStr += groupBy += sortBy}

 
    console.log(queryStr)

    const {rows} = await db.query(queryStr, queryValues);

    console.log(rows)

    const propertiesData = rows.map((row) => {
        const {property_id, name, location, price_per_night, first_name, surname} = row

        const propertyObj = {
            property_id: property_id,
            property_name: name,
            location: location, 
            price_per_night: price_per_night,
            host: `${first_name} ${surname}`
        }

        return propertyObj
    })
    
    return propertiesData;
}

exports.selectReviewsByProperty = async(id) => {

   const {rows} = await db.query(`SELECT review_id, comment, rating, created_at, first_name, surname, avatar, AVG(rating) AS avg_rating
                         FROM reviews
                         JOIN users
                         ON users.user_id = reviews.guest_id
                         WHERE property_id = ${id};`)

   console.log(rows, "<<<<<<<")
}