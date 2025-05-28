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
    let queryValues = []

    let queryStr = `SELECT properties.property_id, host_id, name, location, price_per_night, first_name, surname, COUNT(favourites.property_id)
                    FROM properties
                    JOIN users
                    ON users.user_id = properties.host_id
                    JOIN favourites
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
    if(isNaN(maxprice) && maxprice !== undefined){
        return Promise.reject({status: 400, msg: "Bad request."})
    }
    if(minprice > 0 && minprice < 100000000000){
        if(queryValues.length){
            queryStr += ` AND`
        } else { queryStr += ` WHERE`}
        queryValues.push(minprice)
        queryStr += ` price_per_night >= $${queryValues.length}`
    }
    if(isNaN(minprice) && minprice !== undefined){
        return Promise.reject({status: 400, msg: "Bad request."})
    }
    
    if(host > 0 && host < 100000000000000){
        if(queryValues.length){
            queryStr += ` AND`
        } else {queryStr += ` WHERE`}
        queryValues.push(host)
        queryStr += ` host_id = $${queryValues.length}`
    }
    if(isNaN(host) && host !== undefined){
        return Promise.reject({status: 400, msg: "Bad request."})
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

