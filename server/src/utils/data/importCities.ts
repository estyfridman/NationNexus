import mongoose from 'mongoose';
import { addCitiesToCountry } from '../../services/citiesDBService';
import { citiesData } from '../data/Cities';

const MONGO_URI = 'mongodb://localhost:27017/mydatabase';

const importCities = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await addCitiesToCountry('Germany', citiesData.cities);

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

importCities();
