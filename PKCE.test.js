const { TestScheduler } = require('jest');
const verify = require('./PKCE');

test('verify', () => {
    expect.assertions(1);
    return verify().then(result => {
        expect(result).toBe(true);
    }); 
});