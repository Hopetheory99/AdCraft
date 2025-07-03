const request = require('supertest');
const app = require('./index').default;

describe('auth service', () => {
  it('registers and logs in a user', async () => {
    const register = await request(app).post('/register').send({ email: 'a@b.c', password: 'pass' });
    expect(register.status).toBe(200);
    const login = await request(app).post('/login').send({ email: 'a@b.c', password: 'pass' });
    expect(login.status).toBe(200);
    expect(login.body.tokens.accessToken).toBeDefined();
  });
});
