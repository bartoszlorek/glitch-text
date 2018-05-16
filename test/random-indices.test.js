import randomIndices from '../src/.utils/random-indices'
import { randomness } from './.test-utils.js'

it('should return empty array', () => {
    expect(randomIndices()).toEqual([])
    expect(randomIndices(null)).toEqual([])
    expect(randomIndices(0)).toEqual([])
    expect(randomIndices(0, 5)).toEqual([])
})

it('should keep length greater than or equal count', () => {
    let count = 5,
        indices = randomIndices(count)
    expect(indices.length).toBe(count)
})

it('should return n-length array', () => {
    let count = 5,
        indices = randomIndices(count, 10)
    expect(indices.length).toBe(count)
})

it('should return random indices', () => {
    global.Math.random = randomness(4)
    let indices = randomIndices(10)
    expect(indices).toEqual([2, 3, 6, 1, 8, 0, 4, 5, 7, 9])
})
