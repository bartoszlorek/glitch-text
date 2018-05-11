import glitchText from '../src/index'
import aframe from '../src/.utils/aframe'

const createNode = () => {
    let node = document.createElement('div')
    node.textContent = 'the quick brown fox'
    return node
}
const createDateNow = (now = 0) => {
    return () => now++
}

beforeEach(() => {
    global.Date.now = createDateNow()
    jest.clearAllTimers()
})

global.requestAnimationFrame = callback => {
    return setTimeout(callback, 1)
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
    // duration is irrelevant in this tests

    it('should throw on falsy callback', () => {
        expect(() => glitch.animate()).toThrow()
    })

    it('should call 4 times with progress', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.animate(50, 4, callback)

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls).toEqual([[0.25], [0.5], [0.75], [1]])
    })

    it('should break after 50% of progress', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn(progress => progress < 0.5)
        glitch.animate(50, 20, callback)

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
        expect(calls[0]).toEqual([0.05])
        expect(calls[3]).toEqual([0.2])
        expect(calls[6]).toEqual([0.35])
        expect(calls[9]).toEqual([0.5])
    })
})

describe('repeat', () => {
    it('should throw on falsy callback', () => {
        expect(() => glitch.repeat()).toThrow()
    })

    it('should call 10 times (every 20 sec)', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.repeat(20, 0, callback)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
    })

    it('should stop after 10 repeats', () => {
        let limit = 10
        const glitch = glitchText(createNode())
        const callback = jest.fn(() => --limit > 0)
        glitch.repeat(10, 0, callback)

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
    })

    it('should stop after 50 ms', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.repeat(10, 0, callback, 'uniqueName')
        setTimeout(() => glitch.stop('uniqueName'), 51)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(5)
    })
})
