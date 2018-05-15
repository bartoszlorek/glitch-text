function baseSlice(shredder, string, start, end) {
    let length = string == null ? 0 : string.length
    if (!length) {
        return ''
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
    if (start >= length) {
        return string
    }

    return (
        string.substring(0, start) +
        shredder(string.substring(start, end)) +
        string.substring(end)
    )
}

export default baseSlice
