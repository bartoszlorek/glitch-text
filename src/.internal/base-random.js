import randomIndices from '../.utils/random-indices'

function baseRandom(method, string, percent) {
    let length = string == null ? 0 : string.length
    if (!length || method == null) {
        return ''
    }
    let indices = randomIndices(Math.floor(percent * length), length),
        charset = string.split('')

    indices.forEach(index => {
        charset[index] = method(charset[index])
    })
    return charset.join('')
}

export default baseRandom
