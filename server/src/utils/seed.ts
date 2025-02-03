
import Country from '../models/mongooseSchemas/countrySchema';
import logger from "../utils/logger";

import * as countriesData from './data/countries';

const fetchAndSaveCountries = async () => {
  try {
    // To clear and insert fresh data:
    //await Country.deleteMany({});
    const countryCount = await Country.countDocuments();
    if (countryCount > 0) return
    await Country.insertMany(countriesData.data.countries);
    logger.info(`Saved countries to the database.`);
  } catch (error) {
    logger.error('Error fetching and saving countries:', error);
  }
};

export default fetchAndSaveCountries;