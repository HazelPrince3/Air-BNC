function formatPropertyTypes(propertyTypesData) {

    const formattedPropertyTypes = propertyTypesData.map((propertyType) => {
        const {property_type, description} = propertyType

        return [property_type, description]
    })

    return formattedPropertyTypes
}

function formatUsers(usersData) {

    const formattedUsers = usersData.map((user) => {
        const {first_name, surname, email, phone_number = null, role, avatar} = user

        let is_host = false;

        if(role === "host"){is_host = true};

        return [first_name, surname, email, phone_number, is_host, avatar]
    })
    return formattedUsers
}

function createUsersRef(users) {
    const usersRef = {}

    users.forEach((user) => {
        const host_name =  `${user.first_name} ${user.surname}`;

        usersRef[host_name] = user.user_id;
    })

    return usersRef
}

function formatProperties(propertiesData, userRef){

    const formattedProperties = propertiesData.map((property) => {
        const {host_name, name, location, property_type, price_per_night, description} = property

        const host_id = userRef[host_name]
        
        return [host_id, name, location, property_type, price_per_night, description]
    })

    return formattedProperties
}

function createPropertyRef(properties) {
    const propertiesRef = {}

    properties.forEach((property) => {
        const name = property.name
        const id = property.property_id
        propertiesRef[name] = id;
    })
    
    return propertiesRef
}

function formatReviews(reviewsData, userRef, propertyRef){

    const formattedReviews = reviewsData.map((review) => {
        const {property_name, guest_name, rating, comment = null} = review

        const property_id = propertyRef[property_name]
        const user_id = userRef[guest_name]

        return [property_id, user_id, rating, comment]
    })

    return formattedReviews
}

function formatImages(imagesData, propertyRef) {
    const formattedImages = imagesData.map((image) => {
        const {property_name, image_url, alt_tag} = image

        const property_id = propertyRef[property_name]

        return [property_id, image_url, alt_tag]
    })
    
    return formattedImages
}

function formatFavourites(favouritesData, userRef, propertyRef) {
    const formattedFavourites = []

    favouritesData.forEach((favourite) => {
        const guest_id = userRef[favourite.guest_name]
        const property_id = propertyRef[favourite.property_name]
        
        formattedFavourites.push([guest_id, property_id])
    })

    return formattedFavourites
}

function getAmenities(propertiesData) {
    const formattedAmenities = []

    const amenityArr = []
    const amenityObj = {}
    propertiesData.forEach((property) => {
        const amenities = property.amenities
        amenityArr.push(amenities)
    })

    const flattenedAmenityArr = amenityArr.flat(1)
    flattenedAmenityArr.forEach((amenity) => {
        amenityObj[amenity] = null
    })
    for(let key in amenityObj){
        formattedAmenities.push([key])
    }    
    return formattedAmenities
}

function formatPropertiesAmenities(propertiesData, propertyRef) {
    const formattedPropertiesAmenities = []

    propertiesData.forEach((property) => {
        const property_id = propertyRef[property.name]
        const amenities = property.amenities

        amenities.forEach((amenity) => {
           formattedPropertiesAmenities.push([property_id, amenity])
        })
    })
    
    return formattedPropertiesAmenities
}

function formatBookings(bookingsData, propertyRef, usersRef) {
    const formattedBookings = []

    bookingsData.forEach((booking) => {
        const propertyId = propertyRef[booking.property_name]
        console.log(propertyId)
        const usersId = usersRef[booking.guest_name]
        const checkIn = booking.check_in_date
        const checkOut = booking.check_out_date

        formattedBookings.push([propertyId, usersId, checkIn, checkOut])
   
    })
    return formattedBookings
}
module.exports = {
    formatPropertyTypes:formatPropertyTypes,
    formatUsers:formatUsers, 
    createUsersRef:createUsersRef, 
    formatProperties: formatProperties, 
    createPropertyRef: createPropertyRef,
    formatReviews: formatReviews,
    formatImages: formatImages,
    formatFavourites: formatFavourites,
    getAmenities: getAmenities,
    formatPropertiesAmenities: formatPropertiesAmenities,
    formatBookings: formatBookings};
