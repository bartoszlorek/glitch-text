import randomIndices from '../.utils/random-indices'

function baseRandom(method, string, percent) {
    let length = string == null ? 0 : string.length
    if (!length || method == null) {
        return ''
    }
    if (!percent) {
        return string
    }
    let amount = Math.floor(percent * length),
        indices = randomIndices(amount, length),
        remains = indices.length,
        charset = string.split('')

    while (remains--) {
        let index = indices[remains]
        if (charset[index] !== ' ') {
            charset[index] = method(charset[index])
        }
    }
    return charset.join('')
}

export default baseRandom
