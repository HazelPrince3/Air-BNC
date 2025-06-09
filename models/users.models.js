const db = require("../db/connection")

exports.selectUserById = async(id) => {
    const {rows: [user]} = await db.query(`SELECT user_id, first_name, surname, email, phone_number, avatar, created_at
            FROM users
            WHERE user_id = $1;`, [id])

    if(user === undefined){
        return Promise.reject({status:404, msg: "User not found."})
    }
    return user
}

exports.updateUserInformation = async(id, first_name, surname, email, phone, avatar) => {
    let queryValues = [id]

    let queryStr = `UPDATE users SET`

    if(first_name){
        queryValues.push(first_name)
        
        queryStr += ` first_name = $${queryValues.length}`
        
    }
    
    if(surname){
        queryValues.push(surname)
        if(queryValues.length > 2){
            queryStr += `, surname = $${queryValues.length}`
        }else{ queryStr += ` surname = $${queryValues.length}`}
    }

    if(email){
        queryValues.push(email)
        if(queryValues.length > 2){
            queryStr += `, email = $${queryValues.length}`
        }else{queryStr += ` email = $${queryValues.length}`}
    }

    if(phone){
        queryValues.push(phone)
        if(queryValues.length > 2){
            queryStr += `, phone_number = $${queryValues.length}`
        }else{queryStr += ` phone_number = $${queryValues.length}`}
    }
    if(avatar){
        queryValues.push(avatar)
        if(queryValues.length > 2){
            queryStr += `, avatar = $${queryValues.length}`
        }else{queryStr += ` avatar = $${queryValues.length}`}
    }
    
    const condition = ` WHERE user_id = $1
                                  RETURNING *;`

    queryStr += condition

    
    const {rows: [updatedUser]} = await db.query(queryStr, queryValues)
    
    if(updatedUser === undefined){
        return Promise.reject({status:404, msg: "User not found."})
    }
    return updatedUser
    
}