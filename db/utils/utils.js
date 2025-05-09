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

function formatProperties(properties, userRef){
    const formattedProperties = []

    properties.forEach((property) => {
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


module.exports = {formatPropertyTypes:formatPropertyTypes, formatUsers:formatUsers, createUsersRef:createUsersRef, formatProperties: formatProperties};
