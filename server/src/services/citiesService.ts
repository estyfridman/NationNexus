import City from '../models/mongooseSchemas/citySchema';
import {Types} from 'mongoose';
import ICity from '../models/interfaces/iCity';
import {ERRORS} from '../constants';

class CitiesService {
  async getAllCities() {
    try {
      return await City.find();
    } catch (error) {
      throw new Error(`${ERRORS.GET_ALL_CITIES_ERR} ${(error as Error).message}`);
    }
  }

  async getCityById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(ERRORS.INVALID_ID_ERR);
    }
    try {
      const city = await City.findById(id);
      if (!city) {
        throw new Error(ERRORS.GET_CITY_NF_ERR);
      }
      return city;
    } catch (error) {
      throw new Error(`${ERRORS.GET_CITY_ERR} ${(error as Error).message}`);
    }
  }

  async getCitiesByCountryId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(ERRORS.INVALID_ID_ERR);
    }
    try {
      const cities = await City.find({countryId: id});
      if (!cities || cities.length === 0) {
        return [];
      }
      return cities;
    } catch (error) {
      throw new Error(`${ERRORS.GET_ALL_CITIES_ERR} ${(error as Error).message}`);
    }
  }

  async createCity(cityData: ICity) {
    try {
      const existCity = await City.findOne({name: cityData.name});
      if (existCity) {
        throw new Error(ERRORS.CITY_EXISTS_ERR);
      }
      const newCity = new City(cityData);
      await newCity.validate();
      return await newCity.save();
    } catch (error) {
      throw new Error(`${ERRORS.CREATE_CITY_ERR} ${(error as Error).message}`);
    }
  }

  async updateCity(id: string, updateData: Partial<ICity>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(ERRORS.INVALID_ID_ERR);
    }
    try {
      const city = await City.findByIdAndUpdate(id, updateData, {new: true});
      if (!city) {
        throw new Error(ERRORS.GET_CITY_NF_ERR);
      }
      return city;
    } catch {
      throw new Error(ERRORS.UPDATE_CITY_ERR);
    }
  }

  async deleteCity(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(ERRORS.INVALID_ID_ERR);
    }
    try {
      const city = await City.findByIdAndDelete(id);
      if (!city) {
        throw new Error(ERRORS.GET_CITY_NF_ERR);
      }
      return city;
    } catch {
      throw new Error(ERRORS.DELETE_CITY_ERR);
    }
  }
}

export default new CitiesService();
