import fs from 'fs';
import path from 'path';
import Country from '../models/mongooseSchemas/countrySchema';
import * as countriesData from './data/countries';

const fetchAndSaveCountries = async () => {
  try {
    // To clear and insert fresh data:
    //await Country.deleteMany({});
    const countryCount = await Country.countDocuments();
    if (countryCount > 0) return
    await Country.insertMany(countriesData.data.countries);
    console.log(`Saved countries to the database.`);
  } catch (error) {
    console.error('Error fetching and saving countries:', error);
  }
};

export default fetchAndSaveCountries;