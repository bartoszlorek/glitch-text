function spliceString(string, start, end, replacement) {
    let length = string == null ? -1 : string.length
    if (length < 0) {
        return ''
    }
    if (replacement === undefined && typeof end === 'function') {
        replacement = end
        end = length
    }
    start = start == null ? 0 : start
    end = end === undefined ? length : end

    if (start < 0) {
        start = -start > length ? 0 : length + start
    }
    end = end > length ? length : end
    if (end < 0) {
        end += length
    }
    if (start > end && start < length) {
        end = [start, (start = end)][0]
    }
    if (start > length) {
        return string
    }

    if (typeof replacement === 'function') {
        let value = !length ? '' : string.substring(start, end)
        replacement = replacement(value)
    }
    return (
        string.substring(0, start) +
        (replacement != null ? replacement : '') +
        string.substring(end)
    )
}

export default spliceString
