export const ALERT_MESSAGES = {
  SUCCESS_CREATE_CITY: 'City created successfully!',
  ERROR_CREATE_CITY: 'Failed to create city.',
  SUCCESS_UPDATE_CITY: 'City updated successfully!',
  ERROR_UPDATE_CITY: 'Failed to update city.',
  SUCCESS_DELETE_CITY: 'City deleted successfully!',
  ERROR_UPDATE_ROLE: 'Please select a user and role before clicking update.',
  SUCCESS_DELETE_USER: 'User deleted successfully!',
  ERROR_DELETE: 'Failed to delete the record. Please try again.',
  SUCCESS_CREATE_COUNTRY_T: 'Country Added',
  SUCCESS_CREATE_COUNTRY_B: 'The country was added successfully!',
  ERROR_CREATE_COUNTRY: 'There was an issue adding the country. Please try again.',
  ERROR_CREATE_COUNTRY_LOG: 'Failed to add country:',
  SUCCESS_UPDATE_COUNTRY_B: 'Country updated successfully!',
  ERROR_UPDATE_COUNTRY: 'Failed to update country.',
  GUEST: 'Only admins and users can create countries.',
  NO_ADMIN: 'Only admins can edit countries.',
  NOT_FOUND_TITLE: 'Unable to retrieve data',
  NOT_FOUND_MESSAGE: 'The server is currently unavailable. Please try again later.',
  SUCCESS: 'Success',
  SUCCESS_CREATE_USER: 'User created successfully!',
  ERROR_CREATE_USER: 'Failed to create user.',
  SUCCESS_UPDATE_USER: 'You have successfully updated the user details!',
  ERROR_UPDATE_USER: 'Failed to update user.',
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

export const BUTTON_TEXT = {
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

export const NAVBAR_LINKS = ['/home', '/countries', '/cities'];

export const RR_OPTIONS = ['Pending', 'Approved', 'Rejected'];

export const PATH = {
  USER_IMG: '/images/Default_User.jpg',
  ROOT: '/',
  HOME: '/home',
  EDIT: '/edit/:id',
  CREATE: '/create',
  COUNTRIES: '/countries',
  CITIES_BY_COUNTRY: '/cities/:countryId',
  CITIES: '/cities',
  LOGIN: '/login',
  REGISTER: '/register',
  EDIT_USER: '/editUser/:id',
  ADMIN_DASHBOARD: '/adminDashboard',
  NF: '*',
};

export const FUNCS = {
  EDIT_USER_NAVIGATE: (useID: string) => `/editUser/${useID}`,
};

export const FIELD = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PHONE: 'phone',
  ACTIONS: 'actions',
  NAME: 'name',
};
