function formatPropertyTypes(propertyTypesData) {
    const formattedPropertyTypes = []

    propertyTypesData.forEach((propertyType) => {

        const type = propertyType.property_type
        const description = propertyType.description

        formattedPropertyTypes.push([type, description])
    })
    
    return formattedPropertyTypes 
}

function formatUsers() {

}
module.exports = {formatPropertyTypes:formatPropertyTypes, formatUsers:formatUsers};