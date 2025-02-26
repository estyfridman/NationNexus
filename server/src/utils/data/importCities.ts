import connectDB from '../../config/connectDB';
import City from '../../models/mongooseSchemas/citySchema';
import Country from '../../models/mongooseSchemas/countrySchema';

const URI = 'mongodb+srv://test-user:<password>cluster.4pkqo2v.mongodb.net/db';

const assignCityIdsToCountriesInDB = async () => {
  await connectDB(URI);

  const cities = await City.find();
  const countries = await Country.find();

  const countryToCities: Record<string, string[]> = {
    Switzerland: ['Zürich', 'Geneva', 'Bern'],
    Hungary: ['Budapest', 'Debrecen'],
    Israel: ['Haifa', 'Tel aviv', 'Ramla'],
    Germany: ['Berlin', 'Hamburg'],
    Cambodia: ['Phnom Penh', 'Siem Reap'],
    Iraq: ['Baghdad', 'Basra'],
    Sweden: ['Stockholm', 'Gothenburg'],
    Cuba: ['Havana', 'Santiago de Cuba'],
    Taiwan: ['Kaohsiung', 'Taichung', 'Tainan'],
    UAE: ['Dubai', 'Abu Dhabi'],
    Bulgaria: ['Sofia', 'Plovdiv'],
    Greenland: ['Nuuk'],
    Kyrgyzstan: ['Osh'],
    'Sierra Leone': ['Freetown', 'Kenema'],
    'Cook Islands': ['Rarotonga'],
    Djibouti: ['Djibouti City', 'Ali Sabieh'],
    Grenada: ['Gouyave'],
    France: ['Port-aux-Français'],
    Poland: ['Lemberg'],
  };

  for (const country of countries) {
    const cityIds = cities.filter((city) => countryToCities[country.name]?.includes(city.name)).map((city) => city._id);

    await Country.updateOne({_id: country._id}, {$set: {cityIds}});
  }

  console.log('City IDs updated in MongoDB');
};

assignCityIdsToCountriesInDB()
  .then(() => console.log('Update Completed!'))
  .catch((err) => console.error('Error updating cityIds:', err));
