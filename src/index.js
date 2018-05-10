import parseNode from './.utils/parse-node'
import aframe from './.utils/aframe'

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
    const requests = []

    const setText = value => {
        if (typeof value === 'string') {
            element.textContent = value
        }
    }

    const api = {
        slice: (start, end) => {
            return glitchSlice(originalText, start, end)
        },
        random: percentage => {
            return 0
        },
        animate: (duration = 1000, steps = 20, callback, name = '') => {
            if (typeof callback !== 'function') {
                throw 'animate method needs callback function'
            }
            if (steps <= 0) {
                steps = 1
            }
            let progress = 0
            const stepValue = 1 / steps
            const stepTime = Math.round(duration / steps)

            const request = aframe.setInterval(() => {
                if (progress >= 1) {
                    return false
                }
                progress += stepValue
                if (progress >= 0.99) {
                    progress = 1
                }
                let result = callback(progress)
                if (result === false) {
                    return false
                }
                setText(result)
            }, stepTime)

            request.name = name
            requests.push(request)
            return api
        },
        repeat: (freq = 500, variation = 0, callback, name = '') => {
            if (typeof callback !== 'function') {
                throw 'repeat method needs callback function'
            }
            let request = { name }
            const iterate = () => {
                let delay = freq + variation * (Math.random() * 2 - 1)
                if (delay < 0) {
                    delay = 0
                }
                let next = aframe.setTimeout(() => {
                    if (callback() === false) {
                        return false
                    }
                    iterate()
                }, delay)
                request.id = next.id
            }

            iterate()
            requests.push(request)
            return api
        },
        stop: name => {
            if (name === undefined) {
                requests.filter(request => {
                    aframe.clear(request)
                })
            } else {
                aframe.clear(requests[name])
            }
        }
    }

    return api
}

export default glitchText
