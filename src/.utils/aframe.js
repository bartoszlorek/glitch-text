import './raf-polyfill'

export function repeatUntil(callback) {
    const request = {}
    const loop = () => {
        if (callback() !== false) {
            request.id = requestAnimationFrame(loop)
        }
    }
    request.id = requestAnimationFrame(loop)
    return request
}

export function repeatDelay(callback, delay = 0, ...params) {
    let start = Date.now()
    return repeatUntil(() => {
        let current = Date.now()
        if (current - start >= delay) {
            if (callback.apply(null, params) === false) {
                return false
            }
            start = current
        }
    })
}

export default {
    clear: request => {
        cancelAnimationFrame(request && request.id)
    },
    setInterval: repeatDelay,
    setTimeout: (...args) => {
        const callback = args[0]
        args[0] = (...params) => {
            callback.apply(null, params)
            return false
        }
        return repeatDelay.apply(null, args)
    }
}
