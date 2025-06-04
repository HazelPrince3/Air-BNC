const db = require("../db/connection");

exports.selectProperties = async(maxprice, minprice, sort, order, host) => {

    const validSort = ["price_per_night", "popularity", undefined]
    if(validSort.includes(sort) === false){
        return Promise.reject({status: 400, msg: "Bad request."})
    }
    const validOrders = ["ascending", "descending", undefined]
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
    let queryValues = []

    let queryStr = `SELECT properties.property_id, host_id, name, location, price_per_night, first_name, surname, COUNT(favourites.property_id)
                    FROM properties
                    JOIN users
                    ON users.user_id = properties.host_id
                    LEFT JOIN favourites
                    ON favourites.property_id = properties.property_id`

    if(sort === "price_per_night"){
        queryStr = `SELECT properties.property_id, host_id name, location, price_per_night, first_name, surname
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
    
    
    if(host > 0 && host < 100000000000000){
        if(queryValues.length){
            queryStr += ` AND`
        } else {queryStr += ` WHERE`}
        queryValues.push(host)
        queryStr += ` host_id = $${queryValues.length}`
    }
    
    
    let groupBy = ` GROUP BY properties.property_id, name, location, price_per_night, first_name, surname, host_id`

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
    const propertiesData = rows.map((row) => {
        const {property_id, name, location, price_per_night, first_name, surname, count, host_id} = row

        const propertyObj = {
            property_id: property_id,
            property_name: name,
            location: location, 
            price_per_night: price_per_night,
            host: `${first_name} ${surname}`,
            count: count,
            host_id: host_id
        }

        return propertyObj
    })
    
    return propertiesData;
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

    property.images = images.array

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

   

