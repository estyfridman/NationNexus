import Country from '../models/mongooseSchemas/countrySchema';
import { Types } from 'mongoose';
import ICountry from '../models/interfaces/iCountry';

class CountryService {
  async getAllCountries() {
    return await Country.find();
  }

  async getCountryById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const country = await Country.findById(id);
    if (!country) {
      throw new Error('Country not found');
    }
    return country;
  }

  async createCountry(countryData: ICountry) {
    return await Country.create(countryData);
  }

  async updateCountry(id: string, updateData: Partial<ICountry>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const country = await Country.findByIdAndUpdate(id, updateData, { new: true });
    if (!country) {
      throw new Error('Country not found');
    }
    return country;
  }

  async deleteCountry(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const country = await Country.findByIdAndDelete(id);
    if (!country) {
      throw new Error('Country not found');
    }
    return country;
  }
}

export default new CountryService();

