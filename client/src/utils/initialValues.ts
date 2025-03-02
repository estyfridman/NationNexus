import {RoleEnum} from '../models/enums/RoleEnum';

export const initialUser = {
  _id: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  profileImage: null as File | null,
  role: RoleEnum.GUEST,
  createdAt: new Date(),
};

export const initialLogin = {
  username: '',
  password: '',
};

export const initialCountry = {
  name: '',
  flag: '',
  region: '',
  population: 0,
};

export const initialCity = {
  _id: '',
  name: '',
  population: 0,
  countryId: '',
};
