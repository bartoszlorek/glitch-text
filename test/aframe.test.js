import aframe, { repeatUntil, repeatDelay } from '../src/.utils/aframe'

const expectToBeInRange = (value, a, b) => {
    expect(value).toBeGreaterThanOrEqual(a)
    expect(value).toBeLessThanOrEqual(b)
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

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
    })
})

describe('repeatDelay', () => {
    it('handle errors with falsy values', () => {
        expect(() => repeatDelay()).not.toThrow()
        expect(() => repeatDelay(null)).not.toThrow()

        const callback = jest.fn()
        expect(() => repeatDelay(callback)).not.toThrow()
        expect(callback).toHaveBeenCalledTimes(0)
    })

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

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls.length).toBe(5)
    })
})

describe('api.setTimeout', () => {
    it('handle errors with falsy values', () => {
        expect(() => aframe.setTimeout()).not.toThrow()
        expect(() => aframe.setTimeout(null)).not.toThrow()

        const callback = jest.fn()
        expect(() => aframe.setTimeout(callback)).not.toThrow()
        expect(callback).toHaveBeenCalledTimes(0)
    })

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

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls.length).toBe(1)
        expect(calls[0]).toEqual(['a', 'b'])
    })
})

describe('api.clear', () => {
    it('handle errors with falsy values', () => {
        expect(() => aframe.clear()).not.toThrow()
        expect(() => aframe.clear(null)).not.toThrow()
        expect(() => aframe.clear({})).not.toThrow()
        expect(() => aframe.clear(20)).not.toThrow()
    })

    it('should stop interval after 50 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = aframe.setInterval(callback, 10)
        setTimeout(() => aframe.clear(request), 50)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(4)
    })
})

describe('api.setTaskout', () => {
    it('handle errors with falsy values', () => {
        expect(() => aframe.setTaskout()).not.toThrow()
        expect(() => aframe.setTaskout(null)).not.toThrow()

        const callback = jest.fn()
        expect(() => aframe.setTaskout(callback)).not.toThrow()
        expect(callback).toHaveBeenCalledTimes(0)
    })

    it('should call 4 times with progress', () => {
        const callback = jest.fn()
        aframe.setTaskout(callback, 50, 4)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([[0.25], [0.5], [0.75], [1]])
    })

    it('should stop after 10 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = aframe.setTaskout(callback, 20, 5)
        setTimeout(() => aframe.clear(request), 10)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([[0.2], [0.4]])
    })

    it('should stop after 50% of progress', () => {
        const callback = jest.fn(progress => progress < 0.5)
        aframe.setTaskout(callback, 50, 20)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
        expect(calls[0]).toEqual([0.05])
        expect(calls[3]).toEqual([0.2])
        expect(calls[6]).toEqual([0.35])
        expect(calls[9]).toEqual([0.5])
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = aframe.setTaskout(callback, 10, 2, 'a', 'b')

        jest.runAllTimers()
        const { calls } = callback.mock
        expect(calls).toEqual([[0.5, 'a', 'b'], [1, 'a', 'b']])
    })
})

describe('api.setRandval', () => {
    it('handle errors with falsy values', () => {
        expect(() => aframe.setRandval()).not.toThrow()
        expect(() => aframe.setRandval(null)).not.toThrow()

        const callback = jest.fn()
        expect(() => aframe.setRandval(callback)).not.toThrow()
        expect(callback).toHaveBeenCalledTimes(0)
    })

    it('should call 4 times with different delays', () => {
        const callback = jest.fn()
        aframe.setRandval(callback, 50, 10)

        jest.runTimersToTime(200)
        // min: 200 / (50 + 10) = ceil(3.33) - 1 = 3
        // max: 200 / (50 - 10) = 5 - 1 = 4
        const { calls } = callback.mock
        expectToBeInRange(calls.length, 3, 4)
    })

    it('should stop repeats after 50 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = aframe.setRandval(callback, 20, 5)
        setTimeout(() => aframe.clear(request), 50)

        // min: 50 / (20 + 5) = 2 - 1 = 1
        // max: 50 / (20 - 5) = ceil(3.33) - 1 = 3
        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expectToBeInRange(calls.length, 1, 3)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        aframe.setRandval(callback, 50, 10, 'a', 'b')

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenLastCalledWith('a', 'b')
    })
})
