import spliceString from '../.utils/splice-string'

function baseSlice(method, string, start, end) {
    let length = string == null ? 0 : string.length
    if (!length) {
        return ''
    }
    // convert percentage value to index
    if (start != null) {
        start = Math.floor(length * start)
    }
    if (end != null) {
        end = Math.floor(length * end)
    }
    return spliceString(string, start, end, method)
}

export default baseSlice
