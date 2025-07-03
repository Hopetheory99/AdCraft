const request = require('supertest');
const app = require('./index').default;

describe('asset service', () => {
  it('rejects upload without file', async () => {
    const res = await request(app).post('/upload');
    expect(res.status).toBe(400);
  });
});
