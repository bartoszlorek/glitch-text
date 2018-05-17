function enumArray(length, array) {
    let result = array != null ? array : [],
        index = 0

    while (index < length) {
        result.push(index++)
    }
    return result
}

export default enumArray
