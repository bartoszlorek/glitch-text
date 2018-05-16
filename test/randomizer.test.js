import randomizer from '../src/.internal/randomizer'

it('should handle undefined charset', () => {
    const random = randomizer()
    expect(random('test')).toBe('')
})

it('should handle falsy string', () => {
    const random = randomizer('xxx')
    expect(random()).toBe('')
    expect(random(null)).toBe('')
    expect(random('')).toBe('')
})

it('should replace string with charset', () => {
    const random = randomizer('xxx')
    expect(random('quick brown fox')).toBe('xxxxxxxxxxxxxxx')
})
