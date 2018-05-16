import spliceString from '../.utils/splice-string'

// todo: start and end as a percent value
function baseSlice(method, string, start, end) {
    return spliceString(string, start, end, method)
}

export default baseSlice
