import {atom} from 'recoil';
import ICity from '../../models/interfaces/iCity';

const cityState = () => {
  return atom<ICity | null>({
    key: `cityState`,
    default: {
      _id: '',
      name: '',
    },
  });
};

export const selectedCityState = cityState();
