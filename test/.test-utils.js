export function randomness(length = 1, countLimit = 100000) {
    let index = -1
    return () => {
        if (++index > countLimit) {
            throw new Error(`Ran random ${countLimit} times! Assuming we've hit an infinite recursion.`)
        }
        return (index % length) / length
    }
}
