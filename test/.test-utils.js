export function randomness(length = 1) {
    let index = 0
    const get = n => (Math.abs(n) % length) / length
    const api = () => get(index++)
    api.step = get
    return api
}
