import './raf-polyfill'
import Fraction from 'fraction.js'

const factor = () => Math.random() * 2 - 1
const isRequest = value => value && typeof value.id === 'number'

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

export function repeatDelay(callback, delay, ...params) {
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
        if (isRequest(request)) {
            cancelAnimationFrame(request.id)
            request.id = -1
        }
    },
    setInterval: repeatDelay,
    setTimeout: (...args) => {
        const callback = args[0]
        args[0] = (...params) => {
            callback.apply(null, params)
            return false
        }
        return repeatDelay.apply(null, args)
    },
    setTaskout: (callback, duration, steps, ...params) => {
        if (steps <= 0) {
            steps = 1
        }
        let progress = new Fraction(0)
        const delay = Math.round(duration / steps)
        const task = () => {
            if (progress < 1 && request.id !== -1) {
                progress = progress.add(1 / steps)
                if (callback(progress.valueOf(), ...params) !== false) {
                    return true
                }
            }
            return false
        }
        const request = repeatDelay(task, delay)
        return request
    },
    setRandval: (callback, freq, variation, ...params) => {
        if (callback == null) {
            return {}
        }
        const request = {}
        const iterate = initial => {
            if (request.id !== -1) {
                if (!initial && callback.apply(null, params) === false) {
                    return false
                }
                let delay = freq + variation * factor()
                if (delay < 0) {
                    delay = 0
                }
                let { id } = repeatDelay(iterate, delay)
                request.id = id
            }
            return false
        }
        iterate(true)
        return request
    }
}
