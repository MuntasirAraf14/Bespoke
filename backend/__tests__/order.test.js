import request from 'supertest';
import { app, server } from '../server.js';
import mongoose from 'mongoose';

describe('Backend API readiness tests', () => {
  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
    await mongoose.connection.close();
  });

  it('allows admin login without a database connection', async () => {
    const response = await request(app)
      .post('/api/user/admin')
      .send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('rejects protected order placement without a token', async () => {
    const response = await request(app)
      .post('/api/order/place')
      .send({
        userId: 'testuser',
        items: [], // Empty items for simple test
        amount: 1, // Maliciously low amount
        address: { city: 'Dhaka', state: 'Dhaka' }
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('returns a clear 503 response for database-backed routes when MongoDB is unavailable', async () => {
    const response = await request(app).get('/api/product/list');

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/Database unavailable/);
  });
});
