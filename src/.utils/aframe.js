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
    setTimeout: function(callback, delay, ...params) {
        if (callback == null) {
            return noRequest()
        }
        let wrap = () => {
            callback.apply(null, params)
            return false
        }
        return repeatDelay(wrap, delay)
    },

    waitTimeout: function(callback, delay, ...params) {
        let index = 0,
            request = {}

        const stack = []
        const self = (...args) => {
            stack.push(args)
            request = {
                waitTimeout: self,
                id: -1
            }
            return request
        }
        setTimeout(() => {
            const resolve = () => {
                let args = stack[index++]
                if (args === undefined) {
                    return
                }
                let callback = args[0]
                if (callback == null) {
                    return resolve()
                }
                args[0] = function() {
                    let result = callback.apply(null, arguments)
                    if (result !== false && request.id !== -1) {
                        resolve()
                    }
                    return false
                }
                let { id } = repeatDelay.apply(null, args)
                request.id = id
            }
            resolve()
        }, 0)

        return self.apply(null, arguments)
    },

    setTaskout: function(callback, duration, steps, ...params) {
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

    setRandval: function(callback, delay, variation, ...params) {
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
