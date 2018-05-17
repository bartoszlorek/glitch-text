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

export default shuffle
