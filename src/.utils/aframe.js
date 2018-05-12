import './raf-polyfill'
import Fraction from 'fraction.js'

const factor = value => (Math.random() * 2 - 1) * value
const isRequest = value => value && typeof value.id === 'number'
const noRequest = () => ({ id: -1 })

export function repeatUntil(callback) {
    if (callback == null) {
        return noRequest()
    }
    const request = {}
    const loop = () => {
        if (callback() !== false) {
            request.id = requestAnimationFrame(loop)
        }
    }
    request.id = requestAnimationFrame(loop)
    return request
}

export function repeatDelay(callback, delay, ...params) {
    if (callback == null) {
        return noRequest()
    }
    delay = delay || 0
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

const api = {
    clear: request => {
        if (isRequest(request)) {
            cancelAnimationFrame(request.id)
            request.id = -1
        }
    },
    setInterval: repeatDelay,
    setTimeout: (...args) => {
        const callback = args[0]
        if (callback == null) {
            return noRequest()
        }
        args[0] = (...params) => {
            callback.apply(null, params)
            return false
        }
        return repeatDelay.apply(null, args)
    },

    setTaskout: (callback, duration, steps, ...params) => {
        if (callback == null) {
            return noRequest()
        }
        steps = steps && steps > 0 ? steps : 1
        let progress = new Fraction(0)
        const task = () => {
            if (progress < 1 && request.id !== -1) {
                progress = progress.add(1 / steps)
                if (callback(progress.valueOf(), ...params) !== false) {
                    return true
                }
            }
            return false
        }
        const delay = Math.round(duration / steps)
        const request = repeatDelay(task, delay)
        return request
    },

    setRandval: (callback, delay, variation, ...params) => {
        if (callback == null) {
            return noRequest()
        }
        const request = {}
        const iterate = initial => {
            if (request.id !== -1) {
                if (!initial && callback.apply(null, params) === false) {
                    return false
                }
                let freq = delay + factor(variation)
                if (freq < 0) {
                    freq = 0
                }
                let { id } = repeatDelay(iterate, freq)
                request.id = id
            }
            return false
        }
        iterate(true)
        return request
    }
}

export default api
