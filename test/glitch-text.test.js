import glitchText from '../src/glitch-text'

const createNode = () => {
    let node = document.createElement('div')
    node.textContent = 'the quick brown fox'
    return node
}

it('should return api object', () => {
    const glitch = glitchText(createNode())
    expect(glitch).toEqual(
        expect.objectContaining({
            slice: expect.any(Function),
            random: expect.any(Function),
            restore: expect.any(Function),
            update: expect.any(Function)
        })
    )
})

it('should modify string by slice method', () => {
    const node = createNode()
    const glitch = glitchText(node, 'x')
    glitch.slice(0, 9)
    expect(node.textContent).toBe('xxxxxxxxx brown fox')
})

xit('should modify string by random method', () => {
    const node = createNode()
    const glitch = glitchText(node, 'x')
    glitch.random(0.5)
    expect(node.textContent).toBe('xxxxxxxxx brown fox')
})

it('should restore original text', () => {
    const node = createNode()
    const glitch = glitchText(node, 'x')
    glitch.slice(8)
    expect(node.textContent).toBe('the quicxxxxxxxxxxx')
    glitch.restore()
    expect(node.textContent).toBe('the quick brown fox')
})

it('should update changed text', () => {
    const node = createNode()
    const glitch = glitchText(node, 'x')
    glitch.slice(8)
    expect(node.textContent).toBe('the quicxxxxxxxxxxx')
    node.textContent = 'jumps over lazy dog'
    glitch.update().slice(10)
    expect(node.textContent).toBe('jumps overxxxxxxxxx')
})
