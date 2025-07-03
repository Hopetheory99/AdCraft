const request = require('supertest');
const app = require('./index').default;

describe('api gateway', () => {
  it('rejects protected route without token', async () => {
    const res = await request(app).get('/ads');
    expect(res.status).toBe(401);
  });
});
