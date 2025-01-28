import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; 
import Country from '../models/country';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGO_URL || ' ';


describe('Country API', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  beforeEach(async () => {
    await Country.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /countries', () => {
    it('should retrieve all countries', async () => {
      await Country.create([
        {
          "name": "South Georgia",
          "flag": "https://flagcdn.com/w320/gs.png",
          "population": 30,
          "region": "Antarctic"
        },
        {
          "name": "Grenada",
          "flag": "https://flagcdn.com/w320/gd.png",
          "population": 112519,
          "region": "Americas"
        },
        {
          "name": "Switzerland",
          "flag": "https://flagcdn.com/w320/ch.png",
          "population": 8654622,
          "region": "Europe"
        },
      ]);

      const res = await request(app).get('/countries');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(3);
    });
  });

  describe('GET /countries/:id', () => {
    it('should retrieve a specific country', async () => {
      const country = await Country.create({
        "name": "Switzerland",
        "flag": "https://flagcdn.com/w320/ch.png",
        "population": 8654622,
        "region": "Europe"
      });

      const res = await request(app).get(`/countries/${country._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Switzerland');
    });

    it('should return 404 for non-existent country', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/countries/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /countries', () => {
    it('should create a new country', async () => {
      const newCountry = {
        "name": "France",
        "flag": "https://flagcdn.com/w320/fr.png",
        "population": 67391582,
        "region": "Europe"
      };

      const res = await request(app)
        .post('/countries')
        .send(newCountry);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('France');
    });

    it('should handle validation errors', async () => {
      const invalidCountry = { 
        name: {"common":"South Georgia"},
        flags: {"png":"https://flagcdn.com/w320/gs.png","svg":"https://flagcdn.com/gs.svg"}
      };

      const res = await request(app)
        .post('/countries')
        .send(invalidCountry);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /countries/:id', () => {
    it('should update an existing country', async () => {
      const country = await Country.create({
        "name": "China",
        "flag": "https://flagcdn.com/w320/cn.png",
        "population": 1402112000,
        "region": "Asia"
      });

      const res = await request(app)
        .patch(`/countries/${country._id}`)
        .send({ name: 'Updated China' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated China');
    });
  });

  describe('DELETE /countries/:id', () => {
    it('should delete a country', async () => {
      const country = await Country.create({ 
        "name": "China",
        "flag": "https://flagcdn.com/w320/cn.png",
        "population": 1402112000,
        "region": "Asia"
      });

      const res = await request(app).delete(`/countries/${country._id}`);
      expect(res.statusCode).toBe(200);

      const deletedCountry = await Country.findById(country._id);
      expect(deletedCountry).toBeNull();
    });
  });
});
