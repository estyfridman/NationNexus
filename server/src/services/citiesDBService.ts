import mongoose from 'mongoose';
import Country from '../models/mongooseSchemas/countrySchema';
import City from '../models/mongooseSchemas/citySchema';
import ICity from '../models/interfaces/iCity';
import {MSG_FUNC} from '../constants';
import logger from '../utils/logger';

export const addCitiesToCountry = async (countryName: string, cities: {name: string; population: number}[]) => {
  try {
    const country = await Country.findOne({name: countryName});

    if (!country) {
      throw new Error(MSG_FUNC.COUNTRY_NOT_FOUND(countryName));
    }

    const countryIdObject = new mongoose.Types.ObjectId(country._id);

    const cityDocuments: ICity[] = await City.insertMany(
      cities.map((city) => ({
        name: city.name,
        population: city.population,
        countryId: countryIdObject,
      }))
    );

    await country.save();
    return {country, cities: cityDocuments};
  } catch (error) {
    logger.error(MSG_FUNC.ERROR_ADDING_CITIES((error as Error).message));
    throw error;
  }
};
