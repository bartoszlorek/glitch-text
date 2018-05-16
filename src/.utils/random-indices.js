// The Fisher–Yates shuffle algorithm
function shuffle(arr) {
    var i, j, x
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = arr[i]
        arr[i] = arr[j]
        arr[j] = x
    }
    return arr
}

function randomIndices(amount, length) {
    length = length > amount ? length : amount
    let result = [],
        isUnique

    if (!amount) {
        return result
    }

    // only need to shuffle result
    if (amount === length) {
        while (amount--) {
            result.push(amount)
        }
        return shuffle(result)
    }

    // real picking from greater set
    while (amount--) {
        isUnique = false
        while (!isUnique) {
            let index = Math.floor(Math.random() * length)
            if (result.indexOf(index) < 0) {
                result.push(index)
                isUnique = true
            }
        }
    }
    return result
}

export default randomIndices
