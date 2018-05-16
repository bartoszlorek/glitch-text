import randomizer from '../src/.internal/randomizer'
import { randomness } from './.test-utils.js'

it('should handle undefined charset', () => {
    const random = randomizer()
    expect(random('test')).toBe('')
})

it('should handle falsy string', () => {
    global.Math.random = randomness(8)
    const random = randomizer('fd9g7f&')
    expect(random()).toBe('')
    expect(random(null)).toBe('')
    expect(random('')).toBe('')
})

it('should replace string with charset', () => {
    global.Math.random = randomness(15)
    const random = randomizer('8dgf6*^')
    expect(random('quick brown fox')).toBe('888ddggff66**^^')
})
