function formatPropertyTypes(propertyTypesData) {
    const formattedPropertyTypes = []

    propertyTypesData.forEach((propertyType) => {

        const type = propertyType.property_type
        const description = propertyType.description

        formattedPropertyTypes.push([type, description])
    })
    
    return formattedPropertyTypes 
}

function formatUsers(users) {
    const formattedUsers = []

    users.forEach((user) => {
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
module.exports = {formatPropertyTypes:formatPropertyTypes, formatUsers:formatUsers};
