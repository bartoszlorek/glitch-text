import aframe, { repeatUntil, repeatDelay } from '../src/.utils/aframe'

const expectToBeInRange = (value, a, b) => {
    expect(value).toBeGreaterThanOrEqual(a)
    expect(value).toBeLessThanOrEqual(b)
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

describe('repeatUntil', () => {
    it('should handle errors', () => {
        const request = aframe.setTaskout()
        expect(request).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should return request object', () => {
        const callback = jest.fn()
        const request = repeatUntil(callback)

        expect(request).toEqual(
            expect.objectContaining({
                id: expect.any(Number)
            })
        )
        jest.runTimersToTime(1)
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should stop after falsy output', () => {
        let limit = 10
        const callback = jest.fn(() => --limit > 0)
        const request = repeatUntil(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(10)
    })

    it('should call 20 times', () => {
        const callback = jest.fn()
        const request = repeatUntil(callback)

        jest.runTimersToTime(20)
        expect(callback).toHaveBeenCalledTimes(20)
    })
})

describe('repeatDelay', () => {
    it('should handle errors', () => {
        expect(repeatDelay()).toEqual({ id: -1 })
        expect(repeatDelay(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy delay', () => {
        const callback = jest.fn()
        repeatDelay(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(100)
    })

    it('should stop after falsy output', () => {
        let limit = 5
        const callback = jest.fn(() => --limit > 0)
        const request = repeatDelay(callback, 20)

        jest.runTimersToTime(200) // 100 frames more
        expect(callback).toHaveBeenCalledTimes(5)
    })

    it('should call 10 times (every 20 sec)', () => {
        const callback = jest.fn()
        const request = repeatDelay(callback, 20)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(10)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = repeatDelay(callback, 20, 'a', 'b')

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(10)
        expect(callback).toHaveBeenCalledWith('a', 'b')
    })
})

describe('api.clear', () => {
    it('should handle falsy values', () => {
        expect(() => aframe.clear()).not.toThrow()
        expect(() => aframe.clear(null)).not.toThrow()
        expect(() => aframe.clear({})).not.toThrow()
        expect(() => aframe.clear(20)).not.toThrow()
    })

    it('should stop interval after 50 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = aframe.setInterval(callback, 10)
        setTimeout(() => aframe.clear(request), 50)

        jest.runTimersToTime(150) // 100 frames more
        expect(callback).toHaveBeenCalledTimes(4)
    })

    it('should assign -1 to the request id', () => {
        const request = { id: 10 }
        aframe.clear(request)
        expect(request).toEqual({ id: -1 })
    })
})

describe('api.setTimeout', () => {
    it('should handle errors', () => {
        expect(aframe.setTimeout()).toEqual({ id: -1 })
        expect(aframe.setTimeout(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy delay', () => {
        const callback = jest.fn()
        const request = aframe.setTimeout(callback)
        expect(request).not.toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should call only once', () => {
        const callback = jest.fn()
        aframe.setTimeout(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should stop timer after 20 ms', () => {
        let counter = 0
        const timer = setInterval(() => ++counter, 1)
        const callback = jest.fn(() => clearInterval(timer))
        const request = aframe.setTimeout(callback, 20)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(counter).toBe(20)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = aframe.setTimeout(callback, 5, 'a', 'b')

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('a', 'b')
    })
})

describe('api.waitTimeout', () => {
    it('should handle errors', () => {
        const falsy = expect.objectContaining({
            waitTimeout: expect.any(Function),
            id: -1
        })
        expect(aframe.waitTimeout()).toEqual(falsy)
        expect(aframe.waitTimeout(null)).toEqual(falsy)
        jest.runTimersToTime(100)
    })

    it('should call steps in sequence', () => {
        let counter = 0
        const stack = []
        const timer = setInterval(() => ++counter, 1)
        const step1 = jest.fn(() => stack.push(counter))
        const step2 = jest.fn(() => stack.push(counter))
        const step3 = jest.fn(() => stack.push(counter))
        const step4 = jest.fn(() => stack.push(counter))

        const request = aframe
            .waitTimeout(step1, 10)
            .waitTimeout(step2, 10)
            .waitTimeout(step3, 20)
            .waitTimeout(step4, 30)

        jest.runTimersToTime(200)
        expect(stack).toEqual([10, 20, 40, 70])
    })

    it('should stop after falsy output', () => {
        let limit = 2
        const callback = jest.fn(() => --limit > 0)
        aframe
            .waitTimeout(callback, 10)
            .waitTimeout(callback, 10)
            .waitTimeout(callback, 20)
            .waitTimeout(callback, 30)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should stop after 20 ms', () => {
        const callback = jest.fn()
        const request = aframe
            .waitTimeout(callback, 10)
            .waitTimeout(callback, 10)
            .waitTimeout(callback, 20)
            .waitTimeout(callback, 30)

        setTimeout(() => aframe.clear(request), 20)
        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        aframe
            .waitTimeout(callback, 10, 'a', 'b')
            .waitTimeout(callback, 20, 'c', 'd')

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([['a', 'b'], ['c', 'd']])
    })
})

describe('api.setTaskout', () => {
    it('should handle errors', () => {
        expect(aframe.setTaskout()).toEqual({ id: -1 })
        expect(aframe.setTaskout(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy duration', () => {
        const callback = jest.fn()
        aframe.setTaskout(callback)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1)
    })

    it('should assign 1 to the falsy steps', () => {
        const callback = jest.fn()
        aframe.setTaskout(callback, 10)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1)
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

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([[0.5, 'a', 'b'], [1, 'a', 'b']])
    })
})

describe('api.setRandval', () => {
    it('should handle errors', () => {
        expect(aframe.setRandval()).toEqual({ id: -1 })
        expect(aframe.setRandval(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy delay', () => {
        const callback = jest.fn()
        aframe.setRandval(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(100)
    })

    it('should assign 0 to the falsy variation', () => {
        const callback = jest.fn()
        aframe.setRandval(callback, 10)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(100)
    })

    it('should call 4 times with different delays', () => {
        const callback = jest.fn()
        aframe.setRandval(callback, 50, 10)

        jest.runTimersToTime(200)
        // min: 200 / (50 + 10) = ceil(3.33) - 1 = 3
        // max: 200 / (50 - 10) = 5 - 1 = 4
        // x-1 because callback is after conditional
        const { calls } = callback.mock
        expectToBeInRange(calls.length, 3, 4)
    })

    it('should stop repeats after 50 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = aframe.setRandval(callback, 20, 5)
        setTimeout(() => aframe.clear(request), 50)

        // min: 50 / (20 + 5) = 2 - 1 = 1
        // max: 50 / (20 - 5) = ceil(3.33) - 1 = 3
        // x-1 because callback is after conditional
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
