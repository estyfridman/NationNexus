import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import {describe, expect, beforeEach, it} from '@jest/globals';
import countryRouter from '../routes/countryRoute';
import Country from '../models/mongooseSchemas/countrySchema';
import mockingoose from 'mockingoose';
import {PATH, TEST, MOCK_COUNTRIES, MOCK_COUNTRY, fakeId, SECOND_MOCK_COUNTRY, INVALID_COUNTRY, MESSAGES} from '../constants';

const app = express();
app.use(express.json());
app.use(PATH.COUNTRIES, countryRouter);

describe(TEST.COUNTRY_DESC_TEST, () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe(TEST.GET_COUNTRY_TEST, () => {
    it(TEST.IT_ALL_COUNTRY, async () => {
      mockingoose(Country).toReturn(MOCK_COUNTRIES, 'find');

      const res = await request(app).get(PATH.COUNTRIES);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].name).toBe(TEST.COUNTRY_NAME_T1);
    });
  });

  describe(TEST.GET_BY_ID_COUNTRY_TEST, () => {
    it(TEST.IT_SUCCESS, async () => {
      mockingoose(Country).toReturn(MOCK_COUNTRY, 'findOne');

      const res = await request(app).get(`${PATH.COUNTRIES}/${fakeId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(TEST.COUNTRY_NAME_T2);
    });

    it(TEST.IT_FAILURE, async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      mockingoose(Country).toReturn(null, 'findOne');

      const res = await request(app).get(`${PATH.COUNTRIES}/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe(PATH.POST_COUNTRIES, () => {
    it(TEST.IT_SUCCESS_CREATE_COUNTRY, async () => {
      const newCountry = SECOND_MOCK_COUNTRY;

      mockingoose(Country).toReturn(newCountry, 'save');

      const res = await request(app).post(PATH.COUNTRIES).send(newCountry);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('France');
    });

    it(TEST.IT_VALIDATION_ERR, async () => {
      mockingoose(Country).toReturn(new Error(MESSAGES.VALIDATION_ERR), 'save');
      const res = await request(app).post(PATH.COUNTRIES).send(INVALID_COUNTRY);
      expect(res.statusCode).toBe(400);
    });
  });
});
