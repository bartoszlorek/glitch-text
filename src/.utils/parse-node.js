function parseNode(node) {
    if (node == null) {
        return []
    }
    if (node.length !== undefined) {
        return Array.prototype.slice.call(node)
    }
    return [node]
}

export default parseNode
