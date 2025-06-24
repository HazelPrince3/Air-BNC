const db = require("../db/connection");

exports.selectProperties = async(maxprice, minprice, sort, order, host) => {

    const validSort = ["price_per_night", "popularity", undefined]
     const validOrders = ["ascending", "descending", undefined]

    if(validSort.includes(sort) === false){
        return Promise.reject({status: 400, msg: "Bad request."})
    }
    if(validOrders.includes(order) === false){
        return Promise.reject({status: 400, msg: "Bad request."})
    }
    if(isNaN(maxprice) && maxprice !== undefined){
        return Promise.reject({status: 400, msg: "Bad request."})
    }
    if(isNaN(minprice) && minprice !== undefined){
        return Promise.reject({status: 400, msg: "Bad request."})
    }
    if(isNaN(host) && host !== undefined){
        return Promise.reject({status: 400, msg: "Bad request."})
    }

    const {rows: single_image} = await db.query(`SELECT DISTINCT property_id, image_url as single_image FROM images;`)
    
    let queryValues = []

    let queryStr = `SELECT properties.property_id, host_id, properties.name AS property_name, location, price_per_night, CONCAT(first_name, ' ', surname) host, COUNT(favourites.property_id) AS favourite_count, image
                    FROM properties 
                    JOIN users 
                    ON users.user_id = properties.host_id
                    LEFT JOIN favourites 
                    ON favourites.property_id = properties.property_id
                    LEFT JOIN LATERAL(SELECT DISTINCT ON (property_id) property_id, image_url AS image FROM images) i ON properties.property_id = i.property_id`
                    

    if(sort === "price_per_night"){
        queryStr = `SELECT properties.property_id, host_id, name AS property_name, location, price_per_night, CONCAT(first_name, ' ', surname) host
                    FROM properties 
                    JOIN users
                    ON users.user_id = properties.host_id`
    }

    if(maxprice){
        queryValues.push(maxprice)
        queryStr += ` WHERE price_per_night <= $1`
    }
    
    if(minprice){
        if(queryValues.length){
            queryStr += ` AND`
        } else { queryStr += ` WHERE`}
        queryValues.push(minprice)
        queryStr += ` price_per_night >= $${queryValues.length}`
    }
    
    
    if(host){
        if(queryValues.length){
            queryStr += ` AND`
        } else {queryStr += ` WHERE`}
        queryValues.push(host)
        queryStr += ` host_id = $${queryValues.length}`
    }
    
    
    let groupBy = ` GROUP BY properties.property_id, name, location, price_per_night, first_name, surname, host_id, image`

    let sortBy = ` ORDER BY COUNT(favourites.property_id) DESC;`

    if(order === "ascending" || sort === "popularity"){
        sortBy = ` ORDER BY COUNT(favourites.property_id) ASC;` 
    }
    
    if(sort === "price_per_night"){
        if(order === "descending"){
            queryStr += ` ORDER BY price_per_night DESC;`
        } else{queryStr += ` ORDER BY price_per_night;`}
    } else {queryStr += groupBy += sortBy}

    
    const {rows} = await db.query(queryStr, queryValues);

    if(rows.length === 0){
        return Promise.reject({status: 404, msg: "Host not found"})
    }

    console.log(rows)

    return rows;

}

exports.selectSingleProperty = async(id, user_id) => {

    let queryStr = `SELECT properties.property_id, name AS property_name, location, price_per_night, description, CONCAT(first_name, ' ', surname) host, avatar AS host_avatar, COUNT(favourites.property_id) AS favourite_count
        FROM properties
        JOIN users
        ON properties.host_id = users.user_id
        LEFT JOIN favourites
        ON favourites.property_id = properties.property_id
        WHERE properties.property_id = $1
        GROUP BY properties.property_id, property_name, location, price_per_night, description, host, host_avatar
        ;`

    const {rows : [property]} = await db.query(queryStr, [id])

    if(property === undefined){
        return Promise.reject({status: 404, msg: "Property not found."})
    }

    const {rows: [images]} = await db.query("SELECT ARRAY(SELECT image_url FROM images WHERE property_id = $1)", [id])
    
    const {rows: [amenities]} = await db.query("SELECT ARRAY(SELECT amenity_slug FROM properties_amenities WHERE property_id = $1)", [id])

    property.images = images.array
    property.amenities = amenities.array

    if(user_id){
        const {rows: favourited} = await db.query(`SELECT favourite_id
            FROM favourites
            WHERE guest_id = $1
            AND property_id = $2;`, [user_id, id])
        if(favourited.length){
            property.favourited = true
        }else{property.favourited = false}
    }
    
    return property
}

   

