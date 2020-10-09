export const objectToArray = (object) => {
    return (object === null) ? null : Object.keys(object).map((key) => {
        return {
            key: key,
            ...object[key]
        }
    })
}
