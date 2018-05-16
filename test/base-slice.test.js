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

    it('should replace END with length', () => {
        expect(baseSlice(method, string, 10)).toBe('the quick .........')
    })

    it('should swap START and END', () => {
        expect(baseSlice(method, string, 10, 8)).toBe('the quic..brown fox')
        expect(baseSlice(method, string, -4, -10)).toBe('the quick...... fox')
    })

    it('should take START as an offset from the end', () => {
        expect(baseSlice(method, string, -4)).toBe('the quick brown....')
    })

    it('should take END as an offset from the end', () => {
        expect(baseSlice(method, string, 5, -4)).toBe('the q.......... fox')
    })
})
