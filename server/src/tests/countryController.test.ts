import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; 
import Country from '../models/country';

describe('Country API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
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
        { name: 'Test Country 1', code: 'TC1' },
        { name: 'Test Country 2', code: 'TC2' }
      ]);

      const res = await request(app).get('/countries');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /countries/:id', () => {
    it('should retrieve a specific country', async () => {
      const country = await Country.create({ 
        name: 'Test Country', 
        code: 'TC' 
      });

      const res = await request(app).get(`/countries/${country._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Test Country');
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
        name: 'New Country', 
        code: 'NC' 
      };

      const res = await request(app)
        .post('/countries')
        .send(newCountry);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('New Country');
    });

    it('should handle validation errors', async () => {
      const invalidCountry = { 
        // Missing required fields
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
        name: 'Original Country', 
        code: 'OC' 
      });

      const res = await request(app)
        .put(`/countries/${country._id}`)
        .send({ name: 'Updated Country' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Country');
    });
  });

  describe('DELETE /countries/:id', () => {
    it('should delete a country', async () => {
      const country = await Country.create({ 
        name: 'Country to Delete', 
        code: 'CTD' 
      });

      const res = await request(app).delete(`/countries/${country._id}`);
      expect(res.statusCode).toBe(200);

      const deletedCountry = await Country.findById(country._id);
      expect(deletedCountry).toBeNull();
    });
  });
});
