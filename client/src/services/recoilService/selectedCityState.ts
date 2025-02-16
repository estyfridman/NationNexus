import { atom } from 'recoil';
import ICity from '../../models/interfaces/iCity';

const cityState = () => {
  return atom<ICity | null>({
    key: `cityState`,
    default: {
      _id: '',
      name: '',
      population: 0,
      countryId: '',
    },
  });
};

export const selectedCityState = cityState();
