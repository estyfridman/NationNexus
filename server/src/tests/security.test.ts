import request from 'supertest';
import express from 'express';
import { securityMiddlewares } from '../middlewares/securityMiddleware'; 
import xss from 'xss';
import {describe, expect, it} from '@jest/globals';

const app = express();
app.use(express.json());
app.use(securityMiddlewares);
app.post('/test', (req, res) => {
  res.status(200).send(req.body);
});

app.get('/test', (req, res) => {
  res.status(200).send(req.query);
});


describe('Security Middleware', () => {
  it('should sanitize XSS content in request body', async () => {
    const payload = {
      name: '<script>alert("XSS")</script>',
    };

    const response = await request(app)
      .post('/test')
      .send(payload)
      .expect(200);

    expect(response.body.name).not.toContain('<script>');
    expect(response.body.name).not.toContain('</script>');
    expect(response.body.name).toEqual(xss(payload.name));
  });

  it('should sanitize query parameters', async () => {
    const query = {
      user: '<img src="x" onerror="alert(1)" />',
    };

    const response = await request(app)
      .get('/test')
      .query(query)
      .expect(200);

    expect(response.body.user).not.toContain('<img>');
    expect(response.body.user).not.toContain('onerror');
  });
});