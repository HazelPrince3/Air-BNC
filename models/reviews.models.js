const db = require("../db/connection")

exports.selectReviewsByProperty = async(id) => {
   
    const {rows: reviews} = await db.query(`SELECT review_id, comment, rating, reviews.created_at, CONCAT(first_name, ' ', surname) guest, avatar AS guest_avatar
                         FROM reviews
                         JOIN users
                         ON users.user_id = reviews.guest_id
                         WHERE reviews.property_id = $1
                         ORDER BY reviews.created_at DESC;`, [id]) 
    
    const {rows: [average]} = await db.query(`SELECT AVG(rating)::DECIMAL(10,2) AS average_rating
                            FROM reviews
                            WHERE reviews.property_id = $1;`, [id] )

    const formattedReviews = {
        reviews: reviews,
        average_rating: average.average_rating
    }
    
    if(formattedReviews.reviews.length === 0){
        return Promise.reject({status: 404, msg: "Id not found."})
    }
    return formattedReviews
   
}

exports.insertPropertyReview = async(guest_id, rating, comment, id) => {
    await db.query(`INSERT INTO reviews (guest_id, rating, comment, property_id) 
        VALUES ($1, $2, $3, $4);`, [guest_id, rating, comment, id])

    const {rows: [review]} = await db.query(`SELECT * FROM reviews    WHERE guest_id = $1
        AND rating = $2
        AND comment = $3
        AND property_id = $4;`, [guest_id, rating, comment, id])
    
    return review
}

exports.deleteReviewById = async(id) => {
    
    const {rowCount} = await db.query("DELETE FROM reviews WHERE review_id = $1", [id])

    if(rowCount === 0){
        return Promise.reject({status: 404, msg: "Review not found."})
    }
    
}