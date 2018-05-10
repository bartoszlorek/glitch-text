import glitchText from '../src/index'
import aframe from '../src/.utils/aframe'

const createNode = () => {
    let node = document.createElement('div')
    node.textContent = 'the quick brown fox jumps over the lazy dog'
    return node
}

global.requestAnimationFrame = callback => {
    return setTimeout(callback, 0)
}

global.cancelAnimationFrame = requestId => {
    clearTimeout(requestId)
}

jest.useFakeTimers()

describe('initialize and error handling', () => {
    it('should throw on incorrect element', () => {
        expect(() => glitchText()).toThrow()
        expect(() => glitchText(null)).toThrow()
        expect(() => glitchText([])).toThrow()
    })

    it('should return api object', () => {
        const glitch = glitchText(createNode())
        expect(glitch).toEqual(
            expect.objectContaining({
                slice: expect.any(Function),
                random: expect.any(Function),
                animate: expect.any(Function),
                repeat: expect.any(Function),
                stop: expect.any(Function)
            })
        )
    })
})

describe('animate', () => {
    // duration is irrelevant in the tests

    it('should throw on falsy callback', () => {
        expect(() => glitch.animate()).toThrow()
    })

    it('should call with progress', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.animate(0, 2, callback)

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls[0]).toEqual([0.5])
        expect(calls[1]).toEqual([1])
    })

    it('should call 20 times', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.animate(0, 20, callback)

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls.length).toBe(20)
    })
})

describe('repeat', () => {
    it('should throw on falsy callback', () => {
        expect(() => glitch.repeat()).toThrow()
    })

    it('should stop after 20 repeats', () => {
        let limit = 0
        const glitch = glitchText(createNode())
        const callback = jest.fn()

        glitch.repeat(10, 0, () => {
            if (++limit > 20) {
                return false
            }
            callback()
        }, 'uniqueName')

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(20)
    })
})
