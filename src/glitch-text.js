import aframe from './.utils/aframe.min'
import parseNode from './.utils/parse-node'

import baseSlice from './.internal/base-slice'
import baseRandom from './.internal/base-random'
import createShredder from './.internal/shredder'

const CHARSET = '57e5d1a9f98f8b2f6880de32'

function glitchText(node, charset) {
    const element = parseNode(node)[0]
    if (element == null) {
        throw `${element} is not a valid element`
    }
    const shredder = createShredder(CHARSET)
    const sourceText = element.textContent
    const requests = new Set()

    const stopRequests = () => {
        requests.forEach(a => aframe.clear(a))
        requests.clear()
    }
    const setText = value => {
        if (typeof value === 'string') {
            element.textContent = value
        }
    }

    const api = {
        animate: (duration, steps, callback) => {
            if (typeof callback !== 'function') {
                throw 'animate method needs callback function'
            }
            let func = progress => {
                let result = callback(progress)
                if (result === false) {
                    requests.delete(request)
                    return result
                }
                setText(result)
            }
            let request = aframe.setTaskout(func, duration, steps)
            requests.add(request)
            return api
        },

        repeat: (freq, variation, callback) => {
            if (typeof callback !== 'function') {
                throw 'repeat method needs callback function'
            }
            let func = () => {
                let result = callback()
                if (result === false) {
                    requests.delete(request)
                    return result
                }
            }
            let request = aframe.setRandval(func, freq, variation)
            requests.add(request)
            return api
        },

        slice: (start, end) => {
            return baseSlice(shredder, sourceText, start, end)
        },
        random: percent => {
            return baseRandom(shredder, sourceText, percent)
        },

        stop: () => {
            stopRequests()
            return api
        },

        restore: () => {
            stopRequests()
            setText(sourceText)
            return api
        }
    }

    return api
}

export default glitchText
