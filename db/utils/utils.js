function formatPropertyTypes(propertyTypesData) {
    const formattedPropertyTypes = []

    propertyTypesData.forEach((propertyType) => {

        const type = propertyType.property_type
        const description = propertyType.description

        formattedPropertyTypes.push([type, description])
    })
    
    return formattedPropertyTypes 
}

function formatUsers(usersData) {
    const formattedUsers = []

    usersData.forEach((user) => {
        const first_name = user.first_name;

        const surname = user.surname;

        const email = user.email;

        let phone_number = null;

        if(user.hasOwnProperty("phone_number")) {phone_number = user.phone_number};

        let is_host = false;

        if(user.role === "host"){is_host = true};

        const avatar = user.avatar

        formattedUsers.push([first_name, surname, email, phone_number, is_host, avatar])
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
    const formattedProperties = []

    propertiesData.forEach((property) => {
        const host_id = userRef[property.host_name]
        const name = property.name
        const location = property.location
        const property_type = property.property_type
        const price_per_night = property.price_per_night
        const description = property.description
        formattedProperties.push([host_id, name, location, property_type, price_per_night, description])
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
    const formattedReviews = []

    reviewsData.forEach((review) => {
        const property_id = propertyRef[review.property_name]
        const user_id = userRef[review.guest_name]
        const rating = review.rating

        const comment = review.hasOwnProperty("comment")? review.comment: null

        formattedReviews.push([property_id, user_id, rating, comment])

    })
    return formattedReviews
}

function formatImages(imagesData, propertyRef) {
    const formattedImages = []

    imagesData.forEach((image) => {
        const property_id = propertyRef[image.property_name]
        const image_url = image.image_url
        const alt_text = image.alt_tag
        formattedImages.push([property_id, image_url, alt_text])
    })

    return formattedImages
}

module.exports = {
    formatPropertyTypes:formatPropertyTypes,
    formatUsers:formatUsers, 
    createUsersRef:createUsersRef, 
    formatProperties: formatProperties, 
    createPropertyRef: createPropertyRef,
    formatReviews: formatReviews,
    formatImages: formatImages};
