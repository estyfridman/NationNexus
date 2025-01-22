import { atom } from 'recoil';

export const selectedCountryState = atom({
  key: 'selectedCountry',
  default: {name: 'Israel', flag: 'logo.svg',
    region: 'asia',
    population: 900000,
}});
