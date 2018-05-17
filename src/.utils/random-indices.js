import enumArray from './enum-array'
import shuffle from './shuffle'

// amount = 4
// length = 10
// => [0, 9, 4, 1]

function randomIndices(amount, length) {
    length = length > amount ? length : amount
    if (!amount) {
        return []
    }

    // simple array shuffle is enough
    if (amount === length) {
        return shuffle(enumArray(amount))
    }

    // pick from greater set
    const buffer = {}
    const result = []
    while (amount) {
        let index = Math.floor(Math.random() * length)
        if (buffer[index] === undefined) {
            buffer[index] = true
            result.push(index)
            amount -= 1
        }
    }
    return result
}

export default randomIndices
