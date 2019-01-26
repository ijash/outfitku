request = require('supertest');
const { User } = require('../../models/user');

let server;

describe('Authentication Middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    })
    afterEach(async () => {
        await server.close();
    });
    // test suite initialization
    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }
    it('should return (value) if (condition)', async () => {

    });
});
