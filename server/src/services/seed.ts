import axios from 'axios';
import mongoose from 'mongoose';
import Country from '../models/country';
import dotenv from 'dotenv';

dotenv.config();
const db = 'mongodb://ehshpiner:kdExc6PGtpz4xYts@ac-vlnvcjo-shard-00-00.3hwmtbz.mongodb.net:27017,ac-vlnvcjo-shard-00-01.3hwmtbz.mongodb.net:27017,ac-vlnvcjo-shard-00-02.3hwmtbz.mongodb.net:27017/?replicaSet=atlas-13bqn0-shard-0&tls=true&authSource=admin'
// process.env.MONGO_URL || ' ';
const API_URL = 'https://restcountries.com/v3.1/all';

const connectDatabase = async () => {
  try {
    await mongoose.connect(db);
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to the database', error);
    process.exit(1);
  }
};

const fetchAndSaveCountries = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response);
    const countries = response.data;

    for (const countryData of countries) {
      const existingCountry = await Country.findOne({ name: countryData.name.common });

      if (!existingCountry) {
        const newCountry = new Country({
          name: countryData.name.common,
          region: countryData.region,
          population: countryData.population,
          languages: countryData.languages ? Object.values(countryData.languages).join(', ') : 'Unknown',
          flag: countryData.flags ? countryData.flags[0] : 'No Flag',
        });

        await newCountry.save();
        console.log(`Saved country: ${countryData.name.common}`);
      } else {
        console.log(`Country ${countryData.name.common} already exists in the database`);
      }
    }
  } catch (error) {
    console.error('Error fetching and saving countries:', error);
  }
};

const seedDatabase = async () => {
  await connectDatabase();
  await fetchAndSaveCountries();
  // mongoose.disconnect();
};

seedDatabase();
