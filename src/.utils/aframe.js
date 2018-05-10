import './raf-polyfill'

function repeatUntil(callback) {
    const request = { name: '' }
    const loop = () => {
        if (callback() !== false) {
            request.id = requestAnimationFrame(loop)
        }
    }
    request.id = requestAnimationFrame(loop)
    return request
}

function repeatDelay(callback, delay = 0) {
    const params = Array.prototype.slice.call(arguments, 2)
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
        const [callback] = args
        args[0] = (...params) => {
            callback.apply(null, params)
            return false
        }
        return repeatDelay.apply(null, args)
    }
}
