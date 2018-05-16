import parseNode from './.utils/parse-node'
import createRandomizer from './.internal/randomizer'
import baseSlice from './.internal/base-slice'
import baseRandom from './.internal/base-random'

const CHARSET = '57e5d1a9f98f8b2f6880de32'

function glitchText(node, charset) {
    let elem = parseNode(node)[0]
    if (elem == null) {
        throw `${elem} is not a valid element`
    }
    let text = ''

    const method = createRandomizer(charset || CHARSET)
    const setText = value => {
        if (typeof value === 'string') {
            elem.textContent = value
        }
    }
    const api = {
        slice: (start, end) => {
            setText(baseSlice(method, text, start, end))
            return api
        },
        random: percent => {
            setText(baseRandom(method, text, percent))
            return api
        },
        restore: () => {
            setText(text)
            return api
        },
        update: () => {
            text = elem.textContent
            return api
        }
    }
    return api.update()
}

export default glitchText
