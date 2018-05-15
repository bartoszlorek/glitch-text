import glitchText from '../src/glitch-text'

const createNode = () => {
    let node = document.createElement('div')
    node.textContent = 'the quick brown fox'
    return node
}
const createDateNow = (now = 0) => {
    return () => now++
}

global.requestAnimationFrame = callback => {
    return setTimeout(callback, 1)
}
global.cancelAnimationFrame = requestId => {
    clearTimeout(requestId)
}
jest.useFakeTimers()

beforeEach(() => {
    global.Date.now = createDateNow()
    jest.clearAllTimers()
})

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
                stop: expect.any(Function),
                restore: expect.any(Function)
            })
        )
    })
})

describe('animate', () => {
    it('should throw on falsy callback', () => {
        const glitch = glitchText(createNode())
        expect(() => glitch.animate()).toThrow()
        expect(() => glitch.animate(10)).toThrow()
        expect(() => glitch.animate(10, 5)).toThrow()
        expect(() => glitch.animate(10, 5, null)).toThrow()
        jest.runTimersToTime(200)
    })

    it('should call 4 times with progress', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.animate(50, 4, callback)

        jest.runTimersToTime(200)
        // prettier-ignore
        expect(callback.mock.calls).toEqual([
            [0.25], [0.5], [0.75], [1]
        ])
    })

    it('should break after 50% of progress', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn(progress => progress < 0.5)
        glitch.animate(50, 20, callback)

        jest.runTimersToTime(200)
        // prettier-ignore
        expect(callback.mock.calls).toEqual([
            [0.05], [0.1], [0.15], [0.2], [0.25],
            [0.3], [0.35], [0.4], [0.45], [0.5]
        ])
    })

    it('should change text by returning string', () => {
        const node = createNode()
        const source = node.textContent
        const glitch = glitchText(node)

        const callback = jest.fn(progress => {
            let end = Math.round(source.length * (1 - progress))
            return source.slice(0, end)
        })
        glitch.animate(4, 4, callback)

        expect(node.textContent).toBe('the quick brown fox')
        jest.runTimersToTime(1)
        expect(node.textContent).toBe('the quick brow')
        jest.runTimersToTime(1)
        expect(node.textContent).toBe('the quick ')
        jest.runTimersToTime(1)
        expect(node.textContent).toBe('the q')
    })
})

describe('repeat', () => {
    it('should throw on falsy callback', () => {
        const glitch = glitchText(createNode())
        expect(() => glitch.repeat()).toThrow()
        expect(() => glitch.repeat(10)).toThrow()
        expect(() => glitch.repeat(10, 5)).toThrow()
        expect(() => glitch.repeat(10, 5, null)).toThrow()
        jest.runTimersToTime(200)
    })

    it('should call 10 times (every 20 sec)', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.repeat(20, 0, callback)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(10)
    })

    it('should stop after 10 repeats', () => {
        let limit = 15
        const glitch = glitchText(createNode())
        const callback = jest.fn(() => --limit > 0)
        glitch.repeat(10, 0, callback)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(15)
    })

    it('should stop after 50 ms', () => {
        const glitch = glitchText(createNode())
        const callback = jest.fn()
        glitch.repeat(10, 0, callback)
        setTimeout(() => glitch.stop(), 50 + 1)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(5)
    })
})
