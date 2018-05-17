function createRandomizer(charset) {
    const length = charset == null ? 0 : charset.length
    const sample = () => {
        return charset[Math.floor(Math.random() * length)]
    }
    if (!length) {
        return () => ''
    }
    return string => {
        let index = string == null ? 0 : string.length,
            result = ''

        while (index--) {
            result += sample()
        }
        return result
    }
}

export default createRandomizer
