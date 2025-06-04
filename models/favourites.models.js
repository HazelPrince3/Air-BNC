const db = require("../db/connection")

exports.insertFavourite = async(id, guest_id) => {
    
    try{
    const {rows: [favourite_id]} = await db.query(`INSERT INTO favourites (guest_id, property_id) VALUES ($1, $2) RETURNING favourite_id;`, [guest_id, id])
    
    const favouritedProperty = {
        msg: "Property favourited successfully.", 
        favourite_id: favourite_id.favourite_id
    }
    return favouritedProperty}
    catch(error){
        if(error.code === '23503'){
        return Promise.reject({status:404, msg: "Property not found."})
    }
        else if(error.code === '22P02'){
            return Promise.reject({status:400, msg: "Bad request."})
        }
    }

}