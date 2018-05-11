import Fraction from 'fraction.js'
import parseNode from './.utils/parse-node'
import aframe from './.utils/aframe'
import createRequests from './.internal/create-requests'

function glitchSlice(string, start, end) {
    // start = (start = parseFloat(start)) || 0;
    // end = (end = parseFloat(end)) || 1;
    // if (start < 0) start = 1 + start;
    // if (end < 0) end = 1 + end;
    // start = clampNumber(start, 0, 1);
    // end = clampNumber(end, 0, 1);
    // var text = this.originalText;
    // if (start === 1 || start > end)
    //     return text;
    // return text
    //     .split('')
    //     .map(function(letter, index) {
    //         if (letter === ' ')
    //             return letter;
    //         var percent = index/text.length;
    //         if (percent >= .99) {
    //             percent = 1;
    //         }
    //         return percent >= start
    //             && percent <= end
    //             && start !== end
    //             ? randomLetter()
    //             : letter;
    //     })
    //     .join('');
}

function glitchText(node, charset) {
    const element = parseNode(node)[0]
    if (element == null) {
        throw `${element} is not a valid element`
    }
    const originalText = element.textContent
    const requests = createRequests()

    const setText = value => {
        if (typeof value === 'string') {
            element.textContent = value
        }
    }
    const getText = () => {
        return element.textContent
    }

    const api = {
        slice: (start, end) => {
            return glitchSlice(originalText, start, end)
        },
        random: percentage => {
            return 0
        },

        animate: (duration, steps, callback, name) => {
            if (typeof callback !== 'function') {
                throw 'animate method needs callback function'
            }
            if (steps <= 0) {
                steps = 1
            }
            let progress = new Fraction(0)
            const delay = Math.round(duration / steps)
            const request = aframe.setInterval(() => {
                if (progress >= 1) {
                    return requests.remove(request)
                }
                progress = progress.add(1 / steps)
                let result = callback(
                    progress.valueOf(),
                    getText(),
                    originalText
                )
                if (result === false) {
                    return requests.remove(request)
                }
                setText(result)
            }, delay)

            requests.add(request, name)
            return api
        },

        repeat: (freq, variation, callback, name) => {
            if (typeof callback !== 'function') {
                throw 'repeat method needs callback function'
            }
            const request = {}
            const iterate = () => {
                let delay = freq + variation * (Math.random() * 2 - 1)
                if (delay < 0) {
                    delay = 0
                }
                let { id } = aframe.setTimeout(() => {
                    if (callback() === false) {
                        return false
                    }
                    iterate()
                }, delay)
                request.id = id
            }
            iterate()
            requests.add(request, name)
            return api
        },

        stop: name => {
            if (name !== undefined) {
                requests.remove(name, request => {
                    aframe.clear(request)
                })
            } else {
                requests.clear(request => {
                    aframe.clear(request)
                })
            }
        }
    }

    return api
}

export default glitchText
