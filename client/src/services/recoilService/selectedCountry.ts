import { atom } from 'recoil';
import { ICountry } from '../../models/interfaces/iCountry';

export const createSelectedCountryState = () =>
  atom<ICountry>({
    key: `selectedCountry_${Math.random()}`,
    default: {
      _id: '',
      name: '',
      flag: '',
      region: '',
      population: 0,
    },
  });

export const selectedCountryState = createSelectedCountryState();
