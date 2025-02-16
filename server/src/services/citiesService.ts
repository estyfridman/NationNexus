import City from '../models/mongooseSchemas/citySchema';
import { Types } from 'mongoose';
import ICity from '../models/interfaces/iCity';
import CountryCity from '../models/mongooseSchemas/CountryCity';

class CitiesService {
  async getAllCities() {
    try {
      return await City.find();
    } catch (error) {
      throw new Error(`Error fetching cities: ${(error as Error).message}`);
    }
  }

  async getCityById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      const city = await City.findById(id);
      if (!city) {
        throw new Error('City not found');
      }
      return city;
    } catch (error) {
      throw new Error(`Error fetching city: ${(error as Error).message}`);
    }
  }

  async getCitiesByCountryId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      const countryCities = await CountryCity.find({ country: id }).populate('city');
      const cities = countryCities.map((countryCity) => countryCity.city);
      if (!cities || cities.length === 0) {
        return [];
      }
      return cities;
    } catch (error) {
      throw new Error(`Error fetching cities: ${(error as Error).message}`);
    }
  }

  async createCity(cityData: ICity) {
    try {
      const existCity = await City.findOne({ name: cityData.name });
      if (existCity) {
        throw new Error('City already exists');
      }
      const newCity = new City(cityData);
      await newCity.validate();
      const savedCity = await newCity.save();

      const countryCityLink = new CountryCity({
        country: cityData.countryId,
        city: savedCity._id,
      });
      await countryCityLink.save();

      return savedCity;
    } catch (error) {
      throw new Error(`Failed to create city: ${(error as Error).message}`);
    }
  }

  async updateCity(id: string, updateData: Partial<ICity>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      const city = await City.findByIdAndUpdate(id, updateData, { new: true });
      if (!city) {
        throw new Error('City not found');
      }
      if (city.countryId) {
        await CountryCity.findOneAndUpdate(
          { city: id },
          { country: updateData.countryId },
          { new: true }
        );
      }
      return city;
    } catch {
      throw new Error('Failed to update city');
    }
  }

  async deleteCity(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    try {
      await CountryCity.deleteMany({ city: id });
      const city = await City.findByIdAndDelete(id);
      if (!city) {
        throw new Error('City not found');
      }
      return city;
    } catch {
      throw new Error('Failed to delete city');
    }
  }
}

export default new CitiesService();
