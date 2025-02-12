import mongoose from 'mongoose';
import Country from '../models/mongooseSchemas/countrySchema';
import City from '../models/mongooseSchemas/citySchema';
import ICity from '../models/interfaces/iCity';

export const addCitiesToCountry = async (
  countryName: string,
  cities: { name: string; population: number }[]
) => {
  try {
    const country = await Country.findOne({ name: countryName });

    if (!country) {
      throw new Error(`Country '${countryName}' not found.`);
    }

    const countryIdObject = new mongoose.Types.ObjectId(country._id);

    const cityDocuments: ICity[] = await City.insertMany(
      cities.map((city) => ({
        name: city.name,
        population: city.population,
        countryId: countryIdObject,
      }))
    );

    const cityIds = cityDocuments
      .map((city) => city._id)
      .filter((id): id is mongoose.Types.ObjectId => !!id);
    country.cityIds.push(...cityIds);
    await country.save();

    console.log(`Added ${cityDocuments.length} cities to '${countryName}'.`);
    return { country, cities: cityDocuments };
  } catch (error) {
    console.error(`Error adding cities to country: ${(error as Error).message}`);
    throw error;
  }
};
