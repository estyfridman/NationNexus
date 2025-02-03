import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { describe, expect, beforeEach, it, jest } from '@jest/globals';
import countryRouter from '../routes/countryRoute';
import Country from '../models/mongooseSchemas/countrySchema';
const mockingoose = require("mockingoose");

const app = express();
app.use(express.json());
app.use('/countries', countryRouter);

describe('Country API (Mocked)', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('GET /countries', () => {
    it('should retrieve all countries', async () => {
      mockingoose(Country).toReturn(
        [
          {
            name: 'South Georgia',
            flag: 'https://flagcdn.com/w320/gs.png',
            population: 30,
            region: 'Antarctic',
          },
          {
            name: 'Grenada',
            flag: 'https://flagcdn.com/w320/gd.png',
            population: 112519,
            region: 'Americas',
          },
          {
            name: 'Switzerland',
            flag: 'https://flagcdn.com/w320/ch.png',
            population: 8654622,
            region: 'Europe',
          },
        ],
        'find'
      );

      const res = await request(app).get('/countries');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].name).toBe('South Georgia');
    });
  });

  describe('GET /countries/:id', () => {
    it('should retrieve a specific country', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      mockingoose(Country).toReturn(
        {
          _id: fakeId,
          name: 'Switzerland',
          flag: 'https://flagcdn.com/w320/ch.png',
          population: 8654622,
          region: 'Europe',
        },
        'findOne'
      );

      const res = await request(app).get(`/countries/${fakeId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Switzerland');
    });

    it('should return 404 for non-existent country', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      mockingoose(Country).toReturn(null, 'findOne');

      const res = await request(app).get(`/countries/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /countries', () => {
    it('should create a new country', async () => {
      const newCountry = {
        name: 'France',
        flag: 'https://flagcdn.com/w320/fr.png',
        population: 67391582,
        region: 'Europe',
      };

      mockingoose(Country).toReturn(newCountry, 'save');

      const res = await request(app).post('/countries').send(newCountry);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('France');
    });

    it('should handle validation errors', async () => {
      const invalidCountry = {
        name: { common: 'South Georgia' },
        flags: { png: 'https://flagcdn.com/w320/gs.png', svg: 'https://flagcdn.com/gs.svg' },
      };

      mockingoose(Country).toReturn(new Error('Validation Error'), 'save');

      const res = await request(app).post('/countries').send(invalidCountry);

      expect(res.statusCode).toBe(400);
    });
  });
});
