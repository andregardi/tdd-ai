const { myFunction } = require('./index');

describe('myFunction', () => {
    it('should return the number itself', () => {
        const result = myFunction(49);
        expect(result).toBe(49);
    });
    it('should return pine on multiples of 3', () => {
        const result = myFunction(9);
        expect(result).toBe('pine');
    });
    it('should return apple on multiples of 5', () => {
        const result = myFunction(10);
        expect(result).toBe('apple');
    });
    it('should return pineapple on multiples of 15', () => {
        const result = myFunction(15);
        expect(result).toBe('pineapple');
    });
    it('should greet on string input', () => {
        const result = myFunction('Joe');
        expect(result).toBe('Hello Joe');
    });
    it('should return the number itself on strings that contains a number', () => {
        const result = myFunction('forty-nine');
        expect(result).toBe(49);
    });
    it('should return the number itself on strings that contains a number with space and case insensitive', () => {
        const result = myFunction('Forty nine');
        expect(result).toBe(49);
    });
    it('should return pine on strings that contains numbers multiples of 3', () => {
        const result = myFunction('Nine');
        expect(result).toBe('pine');
    });
    it('should return apple on strings that contains numbers multiples of 5', () => {
        const result = myFunction('ten');
        expect(result).toBe('apple');
    });
    it('should return pine on strings that contains numbers multiples of 15', () => {
        const result = myFunction('fifteen');
        expect(result).toBe('pineapple');
    });

});
