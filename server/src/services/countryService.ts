import ICountry from '../models/interfaces/iCountry';
import Country from '../models/mongooseSchemas/countrySchema';
import {Types} from 'mongoose';
import City from '../models/mongooseSchemas/citySchema';
import {MESSAGES, MSG_FUNC} from '../constants';

class CountryService {
  async getAllCountries() {
    try {
      return await Country.find().populate('cityIds', 'name');
    } catch (error) {
      throw new Error(MSG_FUNC.FETCH_COUNTRIES((error as Error).message));
    }
  }

  async getCountryById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
    }
    try {
      const country = await Country.findById(id).populate('cityIds', 'name');
      if (!country) {
        throw new Error(MESSAGES.COUNTRY_NOT_FOUND_B);
      }
      return country;
    } catch (error) {
      throw new Error(MSG_FUNC.FETCH_COUNTRY((error as Error).message));
    }
  }

  async createCountry(countryData: ICountry) {
    try {
      const existCountry = await Country.findOne({name: countryData.name});
      if (existCountry) {
        throw new Error(MSG_FUNC.COUNTRY_EXISTS(existCountry.name));
      }
      const cityIds = [];
      if (countryData.cityIds && countryData.cityIds.length > 0) {
        for (const cityName of countryData.cityIds) {
          let city = await City.findOne({name: cityName});
          if (!city) {
            city = new City({name: cityName});
            await city.save();
          }
          cityIds.push(city._id);
        }
      }

      const newCountry = new Country({...countryData, cityIds});
      await newCountry.validate();
      return await newCountry.save();
    } catch (error) {
      throw new Error(MSG_FUNC.CREATE_COUNTRY_FAILED((error as Error).message));
    }
  }

  async updateCountry(id: string, updateData: Partial<ICountry>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
    }
    try {
      const country = await Country.findByIdAndUpdate(id, updateData, {new: true});
      if (!country) {
        throw new Error(MESSAGES.COUNTRY_NOT_FOUND_B);
      }
      return country;
    } catch {
      throw new Error(MESSAGES.UPDATE_COUNTRY_FAILED);
    }
  }

  async deleteCountry(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(MESSAGES.INVALID_ID);
    }
    try {
      const country = await Country.findById(id);
      if (!country) {
        throw new Error(MESSAGES.COUNTRY_NOT_FOUND_B);
      }
      if (country.cityIds && country.cityIds.length > 0) {
        await City.deleteMany({_id: {$in: country.cityIds}});
      }
      await Country.findByIdAndDelete(id);
      return country;
    } catch {
      throw new Error(MESSAGES.DELETE_COUNTRY_FAILED);
    }
  }
}

export default new CountryService();
