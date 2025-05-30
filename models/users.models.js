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