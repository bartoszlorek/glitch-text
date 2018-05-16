function createRandomizer(charset = '') {
    const length = charset.length
    const random = () => {
        return charset[Math.floor(Math.random() * length)]
    }
    return string => {
        if (!length) {
            return ''
        }
        let index = string == null ? 0 : string.length,
            result = ''

        while (index--) {
            result += random()
        }
        return result
    }
}

export default createRandomizer
