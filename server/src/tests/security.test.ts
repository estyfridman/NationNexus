import request from 'supertest';
import express from 'express';
import {securityMiddlewares} from '../middlewares/securityMiddleware';
import xss from 'xss';
import {describe, expect, it} from '@jest/globals';
import {PATH, MOCK_PAYLOAD, TEST, MOCK_QUERY} from '../constants';

const app = express();
app.use(express.json());
app.use(securityMiddlewares);
app.post(PATH.TEST, (req, res) => {
  res.status(200).send(req.body);
});

app.get(PATH.TEST, (req, res) => {
  res.status(200).send(req.query);
});

describe(TEST.SECURITY_DSSC, () => {
  it(TEST.IT_SECURITY_XSS, async () => {
    const response = await request(app).post(PATH.TEST).send(MOCK_PAYLOAD).expect(200);

    expect(response.body.name).not.toContain(TEST.SCRIPT);
    expect(response.body.name).not.toContain(TEST.SCRIPT);
    expect(response.body.name).toEqual(xss(MOCK_PAYLOAD.name));
  });

  it(TEST.IT_SECURITY_SANITIZE_QUERY, async () => {
    const response = await request(app).get(PATH.TEST).query(MOCK_QUERY).expect(200);
    expect(response.body.user).not.toContain(TEST.IMG);
    expect(response.body.user).not.toContain(TEST.ONERR);
  });
});
