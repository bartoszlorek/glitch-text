import baseRandom from '../src/.internal/base-random'
import { randomness } from './.test-utils.js'

const method = () => '.'

describe('error handling', () => {
    it('should return empty string', () => {
        expect(baseRandom()).toBe('')
        expect(baseRandom(null)).toBe('')
        expect(baseRandom(method)).toBe('')
        expect(baseRandom(method, null)).toBe('')
        expect(baseRandom(method, '')).toBe('')
    })
})

describe('percent', () => {
    const string = 'the quick brown fox'

    it('should randomize 50% of string', () => {
        global.Math.random = randomness(string.length)
        expect(baseRandom(method, string, 0.5)).toBe('......... brown fox')
    })
})
