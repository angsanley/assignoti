module.exports.objectToArray = function(object) {
    return (object === null) ? [] : Object.keys(object).map((key) => {
        return {
            key: key,
            ...object[key]
        }
    })
}
