const app = require('../src/app');

describe ('App', () => {
    it('GET /api/ responds with 200 and message', () => {
        return supertest(app)
            .get('/api/')
            .expect(200, `Hello, What's Next? user!`)
    })
})