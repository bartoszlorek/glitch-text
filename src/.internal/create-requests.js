/*
    request = {
        name: [String]
        id: [Number]
    }
*/

function createRequests(set = []) {
    return {
        add: (request, name) => {
            request.name = name || ''
            set.push(request)
            return true
        },
        remove: (request, iteratee) => {
            let index = -1
            const length = set.length
            const name = typeof request === 'string'
                ? request : request.name

            while (++index < length) {
                if (set[index].name === name) {
                    if (iteratee != null) {
                        iteratee(set[index])
                    }
                    set.splice(index, 1)
                    return false
                }
            }
            return false
        },
        clear: iteratee => {
            let index = set.length
            while (index--) {
                if (iteratee != null) {
                    iteratee(set[index])
                }
                set.pop()
            }
            return false
        }
    }
}

export default createRequests
