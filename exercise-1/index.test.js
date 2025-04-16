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
});
