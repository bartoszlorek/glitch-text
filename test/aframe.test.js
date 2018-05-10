import aframe, { repeatUntil, repeatDelay } from '../src/.utils/aframe'

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

describe('repeatUntil', () => {
    it('should return request object', () => {
        const callback = jest.fn(() => false)
        const request = repeatUntil(callback)

        expect(request).toEqual(
            expect.objectContaining({
                id: expect.any(Number)
            })
        )
        jest.runTimersToTime(20)
        const { calls } = callback.mock
        expect(calls.length).toBe(1)
    })

    it('should call 20 times', () => {
        const callback = jest.fn()
        const request = repeatUntil(callback)

        jest.runTimersToTime(20)
        const { calls } = callback.mock
        expect(calls.length).toBe(20)
    })

    it('should stop after falsy output', () => {
        let limit = 10
        const callback = jest.fn(() => --limit > 0)
        const request = repeatUntil(callback)

        jest.runTimersToTime(20)
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
    })
})

describe('repeatDelay', () => {
    it('should call 10 times (every 20 sec)', () => {
        const callback = jest.fn()
        const request = repeatDelay(callback, 20)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = repeatDelay(callback, 20, 'a', 'b')

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
        expect(calls[0]).toEqual(['a', 'b'])
        expect(calls[4]).toEqual(['a', 'b'])
        expect(calls[8]).toEqual(['a', 'b'])
    })

    it('should stop after falsy output', () => {
        let limit = 5
        const callback = jest.fn(() => --limit > 0)
        const request = repeatDelay(callback, 20)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(5)
    })
})

describe('api.setTimeout', () => {
    it('should call after 20 ms', () => {
        let counter = 0
        const timer = setInterval(() => ++counter, 1)
        const callback = jest.fn(() => clearInterval(timer))
        const request = aframe.setTimeout(callback, 20)

        jest.runTimersToTime(100)
        const { calls } = callback.mock
        expect(calls.length).toBe(1)
        expect(counter).toBe(20)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = aframe.setTimeout(callback, 5, 'a', 'b')

        jest.runTimersToTime(100)
        const { calls } = callback.mock
        expect(calls.length).toBe(1)
        expect(calls[0]).toEqual(['a', 'b'])
    })
})

describe('api.clear', () => {
    it('should handle falsy values', () => {
        expect(() => aframe.clear()).not.toThrow()
        expect(() => aframe.clear(null)).not.toThrow()
        expect(() => aframe.clear({})).not.toThrow()
        expect(() => aframe.clear(20)).not.toThrow()
    })

    it('should stop interval after 50 ms', () => {
        const callback = jest.fn()
        const request = aframe.setInterval(callback, 10)
        aframe.setTimeout(() => aframe.clear(request), 50)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(5)
    })
})
