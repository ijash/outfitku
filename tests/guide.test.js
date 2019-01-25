


//unit test - real fn
describe('test group name', () => {

    it('should return (value) if (condition)', () => {
        // const result = imported.function(arg);

        // expect(result).toBe('val')
    });
});
//unit test - mock fn, try to mock as little as possible dependencies
describe('test group name', () => {

    it('should return (value) if (condition)', () => {

        // imported.function = jest.fn().mockReturnValue('value');

        // const result = imported.function(arg);

        // expect(result).toHaveBeenCalledWith(arg)
    });
});
// integration test

request = require('supertest');

describe('test group name', () => {
    beforeEach(() => {
        //load server/external dependencies
    });
    afterEach(() => {
        //close the server/connection
    });

    it('should return (value) if (condition)', async () => {
        // const res = await request(server).get('/api/endpoint');
        // expect(res.status).toBe(200);
    });
});
