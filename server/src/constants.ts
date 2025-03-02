import mongoose from 'mongoose';

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
export const ORIGIN = '*';
export const ALLOWED_HEADERS = ['Content-Type', 'Authorization'];
export const JWT_SECRET = process.env.JWT_SECRET || 'hsjf38fks';

export const TEST = {
  COUNTRY_DESC_TEST: 'Country API (Mocked)',
  IT_ALL_COUNTRY: 'should retrieve all countries',
  GET_COUNTRY_TEST: 'GET /countries',
  COUNTRY_NAME_T1: 'South Georgia',
  GET_BY_ID_COUNTRY_TEST: 'GET /countries/:id',
  IT_SUCCESS: 'should retrieve a specific country',
  IT_FAILURE: 'should return 404 for a non-existent country',
  COUNTRY_NAME_T2: 'Switzerland',
  IT_SUCCESS_CREATE_COUNTRY: 'should create a new country',
  IT_VALIDATION_ERR: 'should handle validation errors',
  SECURITY_DSSC: 'Security Middleware',
  IT_SECURITY_XSS: 'should sanitize XSS content in request body',
  IT_SECURITY_SANITIZE_QUERY: 'should sanitize query parameters',
  SCRIPT: '<script>',
  IMG: '<img>',
  ONERR: 'onerror',
};

export const MOCK_COUNTRIES = [
  {
    name: 'South Georgia',
    flag: 'https://flagcdn.com/w320/gs.png',
    population: 30,
    region: 'Antarctic',
  },
  {
    name: 'Grenada',
    flag: 'https://flagcdn.com/w320/gd.png',
    population: 112519,
    region: 'Americas',
  },
  {
    name: 'Switzerland',
    flag: 'https://flagcdn.com/w320/ch.png',
    population: 8654622,
    region: 'Europe',
  },
];

export const fakeId = new mongoose.Types.ObjectId().toString();

export const MOCK_COUNTRY = {
  _id: fakeId,
  name: 'Switzerland',
  flag: 'https://flagcdn.com/w320/ch.png',
  population: 8654622,
  region: 'Europe',
};

export const SECOND_MOCK_COUNTRY = {
  name: 'France',
  flag: 'https://flagcdn.com/w320/fr.png',
  population: 67391582,
  region: 'Europe',
};

export const LEVELS = {
  INFO: 'info',
  ERROR: 'error',
};

export const INVALID_COUNTRY = {
  name: {common: 'South Georgia'},
  flags: {png: 'https://flagcdn.com/w320/gs.png', svg: 'https://flagcdn.com/gs.svg'},
};

export const MOCK_PAYLOAD = {
  name: '<script>alert("XSS")</script>',
};

export const MOCK_QUERY = {
  user: '<img src="x" onerror="alert(1)" />',
};

export const MESSAGES = {
  RUN: 'Server running on port',
  FAILED_CONNECT: 'Failed to connect to database:',
  RATE_LIMIT: 'Too many requests from this IP.',
  VALIDATION_ERR: 'Validation Error',
  NO_TOKEN: 'No token, authorization denied',
  ERROR_VERIFY: 'Error verifying in',
  TOKEN_NOT_VALID: 'Token is not valid',
  NOT_AUTH: 'Not authorized',
  AUTH_FAIL: 'Authorization failed in',
  AUTH_FAILED: 'Authorization failed',
  ERROR_CREATE_COUNTRY: 'There was an issue adding the country. Please try again.',
  ERROR_CREATE_COUNTRY_LOG: 'Failed to add country:',
  SUCCESS_UPDATE_COUNTRY_B: 'Country updated successfully!',
  ERROR_UPDATE_COUNTRY: 'Failed to update country.',
  GUEST: 'Only admins and users can create countries.',
  NO_ADMIN: 'Only admins can edit countries.',
  NOT_FOUND_TITLE: 'Unable to retrieve data',
  NOT_FOUND_MESSAGE: 'The server is currently unavailable. Please try again later.',
  SUCCESS: 'Success',
};

export const PATH = {
  UPS: '/uploads',
  UP: 'uploads',
  CONFIG: 'config/.env',
  AUTH_API: '/api/auth',
  COUNTRIES_API: '/api/countries',
  USERS_API: '/api/users',
  CITIES_API: '/api/cities',
  PERMISSIONS_API: '/api/permissions',
  HEADER_POLICY: 'cross-origin',
  HEADER_NAME: 'Cross-Origin-Resource-Policy',
  POINTS: '..',
  ERR_LOG: 'logs/error.log',
  COMB_LOG: 'logs/combined.log',
  COUNTRIES: '/countries',
  POST_COUNTRIES: 'POST /countries',
  TEST: '/test',
};

export const ERRORS = {
  GET_ALL_CITIES_ERR: 'Error fetching cities:',
  INVALID_ID_ERR: 'Invalid ID format',
  GET_CITY_NF_ERR: 'City not found',
  GET_CITY_ERR: 'Error fetching city',
  CITY_EXISTS_ERR: 'City already exists',
  CREATE_CITY_ERR: 'Failed to create city: ',
  UPDATE_ROLE_ERR: 'Failed to update role',
  DELETE_USER_ERR: 'Failed to delete user',
  GET_ALL_COUNTRIES_ERR: 'Error fetching countries:',
  GET_COUNTRY_NF_ERR: 'Country not found',
  UPDATE_CITY_ERR: 'Failed to update city',
  DELETE_CITY_ERR: 'Failed to delete city',
};

export const LABELS = {
  NAME: 'Name',
  POPULATION: 'Population',
  COUNTRY: 'Country',
  FLAG_URL: 'Flag Url',
  REGION: 'Region',
  SELECT_COUNTRY: 'Select a country',
  SELECTED_COUNTRY: 'Selected country',
  TO_SELECT_COUNTRY: 'Please select a country',
  ADD_COUNTRY: 'Add New Country',
  ADD_CITY: 'Add New City',
  LOADING: 'Loading countries...',
  ERR_LOAD: 'Error loading countries.',
  NO_COUNTRIES: 'No countries available.',
  USER_NAME: 'User name',
  EMAIL: 'Email address',
  PHONE: 'Phone number',
  ROLE: 'Role',
  CREATED: 'Created At',
  CHANDE_ROLE_F: 'Change Role for',
  CHANDE_ROLE: 'Change Role',
  UP_REQUEST: 'User Permission Requests',
  P_REQUEST: 'Pending Requests',
  A_REQUEST: 'All Requests',
  EDIT_COUNTRY: 'Edit Country',
  REQUEST_PERMISSION: 'Request Permissions',
  NO_PERMISSION: 'No permission to edit.',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  EDIT_USER: 'Edit User',
  CREATE_USER: 'Create New User',
  PASSWORD: 'Password',
  PROFILE: 'Profile Image',
};

export const TEXT = {
  STRING: 'string',
  OBJECT: 'object',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  RESET: 'Reset',
  ADMIN: 'ADMIN DASHBOARD',
  LOGOUT: 'Log Out',
  PROFILE: 'Edit Profile',
  PERMISSION: 'Request for permissions',
  LOGIN: 'Login',
  REGISTER: 'Register',
  USERS: 'Users',
  ADD: 'Add',
  UPDATE: 'Update',
  CREATE: 'Create',
};

export const RR_OPTIONS = ['Pending', 'Approved', 'Rejected'];
