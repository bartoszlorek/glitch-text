import glitchText from '../src/glitch-text'
import { randomness } from './.test-utils.js'

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
    global.Math.random = randomness(10)
    const node = createNode()
    const glitch = glitchText(node, '78fgd89d')
    glitch.slice(0, 9)
    expect(node.textContent).toBe('778fgdd89 brown fox')
})

it('should modify string by random method', () => {
    const node = createNode()
    const percent = 0.5
    const length = node.textContent.length
    const amount = Math.floor(percent * length)

    global.Math.random = randomness(amount)
    const glitch = glitchText(node, 'dg8789fd8g')

    glitch.random(percent)
    expect(node.textContent).toBe('8hd fu9c8 7r8wg dox')
})

it('should restore original text', () => {
    global.Math.random = randomness(8)
    const node = createNode()
    const glitch = glitchText(node, '7df^&')
    glitch.slice(8)
    expect(node.textContent).toBe('the quic77ddf^^&77d')
    glitch.restore()
    expect(node.textContent).toBe('the quick brown fox')
})

it('should update changed text', () => {
    const node = createNode()
    const glitch = glitchText(node, '.')
    glitch.slice(8)
    expect(node.textContent).toBe('the quic...........')
    node.textContent = 'jumps over lazy dog'
    glitch.update().slice(10)
    expect(node.textContent).toBe('jumps over.........')
})
