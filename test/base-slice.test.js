import baseSlice from '../src/.internal/base-slice'

const method = string => '.'.repeat(string.length)

describe('error handling', () => {
    it('should return empty string', () => {
        expect(baseSlice()).toBe('')
        expect(baseSlice(null)).toBe('')
        expect(baseSlice(method)).toBe('')
        expect(baseSlice(method, null)).toBe('')
        expect(baseSlice(method, '')).toBe('')
    })
})

describe('start and end', () => {
    const string = 'the quick brown fox'
    const slice = baseSlice.bind(null, method)

    it('should replace END with length', () => {
        expect(slice(string, 0.5)).toBe('the quick..........')
        expect(slice(string, 0.75)).toBe('the quick brow.....')
    })

    it('should swap START and END', () => {
        expect(slice(string, 0.5, 0.25)).toBe('the ..... brown fox')
        expect(slice(string, -0.1, -0.5)).toBe('the quick........ox')
    })

    it('should take START as an offset from the end', () => {
        expect(slice(string, -0.5)).toBe('the quick..........')
    })

    it('should take END as an offset from the end', () => {
        expect(slice(string, 0.5, -0.1)).toBe('the quick........ox')
    })
})
