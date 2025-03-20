import mongoose from 'mongoose';
import {RoleEnum} from './models/enums/roleEnum';
import {PermissionEnum} from './models/enums/permissionEnum';
import {RoleRequestStatusEnum} from './models/enums/RoleRequestStatusEnum';

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
export const ORIGIN = '*';
export const ALLOWED_HEADERS = ['Content-Type', 'Authorization'];

export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

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

export const MOCK_USER = {
  _id: '507f1f77bcf86cd799439011',
  firstName: 'Alice',
  lastName: 'Bob',
  username: 'alice123',
  email: 'alice@mail.com',
  password: 'passwordAlice',
  role: RoleEnum.ADMIN,
  permissions: [PermissionEnum.EDIT, PermissionEnum.DELETE, PermissionEnum.ADD],
  createdAt: new Date(),
  phone: '111-111-1111',
};

export const MOCK_USER_WITHOUT_PASSWORD = {
  _id: '507f1f77bcf86cd799439011',
  firstName: 'Alice',
  lastName: 'Bob',
  username: 'alice123',
  email: 'alice@mail.com',
  role: RoleEnum.ADMIN,
  permissions: [PermissionEnum.EDIT, PermissionEnum.DELETE, PermissionEnum.ADD],
  createdAt: new Date(),
  phone: '111-111-1111',
};
export const MOCK_USERS = [
  {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'Alice',
    lastName: 'Bob',
    username: 'alice123',
    email: 'alice@mail.com',
    password: 'passwordAlice',
    role: RoleEnum.ADMIN,
    permissions: [PermissionEnum.EDIT, PermissionEnum.DELETE, PermissionEnum.ADD],
    createdAt: new Date(),
    phone: '111-111-1111',
  },
  {
    _id: '5f8d0f5b9c5a5a0d9c9b9b9b',
    firstName: 'Bob',
    lastName: 'Bob',
    username: 'bob_the_user',
    email: 'bob@mail.com',
    password: 'passwordBob',
    role: RoleEnum.USER,
    permissions: [PermissionEnum.VIEW],
    createdAt: new Date(),
    phone: '222-222-2222',
  },
  {
    _id: '60a5e8a39c5a5a0d9c9b9b9b',
    firstName: 'Charlie',
    lastName: 'Charlie',
    username: 'charlie_dev',
    email: 'charlie@mail.com',
    password: 'passwordCharlie',
    role: RoleEnum.GUEST,
    permissions: [],
    createdAt: new Date(),
    phone: '333-333-3333',
  },
];

export const MOCK_USERS_WOPASS = [
  {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'Alice',
    lastName: 'Bob',
    username: 'alice123',
    email: 'alice@mail.com',
    role: RoleEnum.ADMIN,
    permissions: [PermissionEnum.EDIT, PermissionEnum.DELETE, PermissionEnum.ADD],
    createdAt: new Date(),
    phone: '111-111-1111',
  },
  {
    _id: '5f8d0f5b9c5a5a0d9c9b9b9b',
    firstName: 'Bob',
    lastName: 'Bob',
    username: 'bob_the_user',
    email: 'bob@mail.com',
    role: RoleEnum.USER,
    permissions: [PermissionEnum.VIEW],
    createdAt: new Date(),
    phone: '222-222-2222',
  },
  {
    _id: '60a5e8a39c5a5a0d9c9b9b9b',
    firstName: 'Charlie',
    lastName: 'Charlie',
    username: 'charlie_dev',
    email: 'charlie@mail.com',
    role: RoleEnum.GUEST,
    permissions: [],
    createdAt: new Date(),
    phone: '333-333-3333',
  },
];

export const MOCK_USERS_AFTER_DELETE = [
  {
    _id: '5f8d0f5b9c5a5a0d9c9b9b9b',
    firstName: 'Bob',
    lastName: 'Bob',
    username: 'bob_the_user',
    email: 'bob@mail.com',
    role: RoleEnum.USER,
    permissions: [PermissionEnum.VIEW],
    createdAt: new Date(),
    phone: '222-222-2222',
  },
  {
    _id: '60a5e8a39c5a5a0d9c9b9b9b',
    firstName: 'Charlie',
    lastName: 'Charlie',
    username: 'charlie_dev',
    email: 'charlie@mail.com',
    role: RoleEnum.GUEST,
    permissions: [],
    createdAt: new Date(),
    phone: '333-333-3333',
  },
];

export const MESSAGES = {
  INVALID_PERMISSION: 'Invalid permission',
  FAILED_UPDATE_USER_PERMISSIONS: 'Update user permissions failed',
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
  LOGIN_FAILED: 'Login failed',
  USER_NOT_FOUND: 'User Not Found',
  RESET_PASS_SEND: 'A password reset link was sent to the email',
  RESET_PASS_NOT_SEND: 'Error in the password reset process',
  INVALID_TOKEN: 'Invalid or expired token',
  PASS_UPDATE_SUCCESS: 'Password updated successfully',
  ERROR_RESET_PASS: 'Password reset error',
  UNKNOWN_ERROR: 'An unknown error occurred',
  SUCCESS_DELETE_CITY: 'City deleted successfully',
  APPROVED_ERR_MSG: 'Missing userId or permission for APPROVED status.',
  ERR_REQ_ROLE: 'Error requesting role change',
  SUCCESS_UPDATE_ROLE: 'User role updated successfully!',
  ERR_UPDATE_ROLE: 'Error updating user role',
  SUCCESS_UPDATE_COUNTRY_B: 'Country updated successfully!',
  ERROR_UPDATE_COUNTRY: 'Failed to update country.',
  GUEST: 'Only admins and users can create countries.',
  NO_ADMIN_EDIT: 'Only admins can edit countries.',
  NO_ADMIN: 'Only admins can delete.',
  NO_PERMISSIONS: 'Permissions...',
  NOT_FOUND_TITLE: 'Unable to retrieve data',
  NOT_FOUND_MESSAGE: 'The server is currently unavailable. Please try again later.',
  SUCCESS: 'Success',
  SUCCESS_DELETE_USER: 'User deleted successfully!',
  SUCCESS_UPDATE_USER: 'User updated successfully!',
  SUCCESS_REGIS_USER: 'User registered successfully!',
  ERR_RETRIEVE_USER: 'Error retrieving user',
  ERR_REGIS_USER: 'Error registering user: ',
  ERR_DELETE_USER: 'Error deleting user',
  ERR_UPDATE_USER: 'Error updating user',
  MONGO_CONNECTION_ERR: 'MongoDB connection error: ',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USERNAME_PASSWORD_REQUIRED: 'Username and password are required',
  AUTHENTICATION_FAILED: 'Failed to authenticate user',
  INVALID_ID: 'Invalid ID format',
  COUNTRY_NOT_FOUND_B: 'Country not found',
  UPDATE_COUNTRY_FAILED: 'Failed to update country',
  DELETE_COUNTRY_FAILED: 'Failed to delete country',
  EMAIL_FAILED: 'Email failed',
  ERR_EMAIL: 'Error sending email',
  PERMISSION_GET_FAILED: 'Failed to get permission requests',
  PERMISSION_DELETE_FAILED: 'Failed to delete permission requests',
  PERMISSION_NOT_FOUND: 'Permission request not found',
  FAILED_GET_USERS: 'Failed to get users',
  FAILED_GET_USER: 'Failed to get user by id',
  MISS_FIELDS: 'Missing required fields',
  EMAIL_EXISTS: 'Email already exists',
  USERNAME_EXISTS: 'Username already exists',
  FAILED_CREATE_USER: 'Failed to create user',
  FAILED_UPDATE_USER: 'Failed to update user',
  FAILED_DELETE_USER: 'Failed to delete user',
  FAILED_UPDATE_USER_ROLE: 'Failed to update user role',
  FAILED_REQUEST_ROLE: 'Failed to request role change',
  IMG_FILE_ERR: 'Only image files are allowed!',
};

export const MSG_FUNC = {
  COUNTRY_EXISTS: (countryName: string) => `${countryName} already exists`,
  CREATE_COUNTRY_FAILED: (errorMessage: string) => `Failed to create country: ${errorMessage}`,
  COUNTRY_NOT_FOUND: (countryName: string) => `Country '${countryName}' not found.`,
  ERROR_ADDING_CITIES: (errorMessage: string) => `Error adding cities to country: ${errorMessage}`,
  FETCH_COUNTRIES: (errorMessage: string) => `Error fetching countries: ${errorMessage}`,
  FETCH_COUNTRY: (errorMessage: string) => `Error fetching country: ${errorMessage}`,
  RESET_URL: (resetToken: string) => `${APP_CONFIG.FRONTEND_URL}/reset-password?token=${resetToken}`,
  EMAIL_INFO: (infoMessage: string) => `Email sent: ${infoMessage}`,
  PERMISSION_UPDATE_FAILED: (errorMessage: string) => `Failed to update permission request: ${errorMessage}`,
  REQUEST_ROLE_SEND: (requestedRole: string) => `Request for role change to ${requestedRole} has been sent for approval.`,
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
  DEFAULT_USER: '/images/Default_User.jpg',
  IMG: 'image/',
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
  SHA: 'sha256',
  APPROVED: 'APPROVED',
  SERVICE_MAIL: 'gmail',
  USER: 'user',
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

export const EMAIL_TEMPLATES = {
  PASSWORD_RESET_SUBJECT: 'Password Reset',
  PASSWORD_RESET_HTML: (resetUrl: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset</h2>
      <p>We've received a request to reset your password. If it wasn't you, ignore this email.</p>
      <a href="${resetUrl}" 
         style="display: inline-block; 
                background-color: #4CAF50; 
                color: white; 
                padding: 10px 20px; 
                text-decoration: none; 
                border-radius: 5px;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
    </div>
  `,
};

export const APP_CONFIG = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

export const FILESIZE = 5 * 1024 * 1024;

export const PR = {
  _id: '507f1f77bcf86cd799439011',
  userId: {username: 'testuser'},
  requested: PermissionEnum.DELETE,
  status: RoleRequestStatusEnum.PENDING,
  createdAt: new Date(),
};

export const VALID = {
  REQUIRED: 'is required',
  MIN_LEN_NAME: 'Name must be at least 2 characters long',
  MAX_LEN_NAME: 'Name must not exceed 40 characters',
  REQUIRED_NAME: 'Name is required',
  MIN_LEN_CITY: 'City name must be at least 2 characters long',
  MAX_LEN_CITY: 'City name must not exceed 40 characters',
  CITY_INVALID: 'Invalid city ID',
  CITY_REQUIRED: 'City name is required',
  CITY_MATCH: 'City name can only contain letters, spaces, and hyphens',
  COUNTRY_REQUIRE: 'Country name is required',
  MIN_LEN_COUNTRY: 'Country name must be at least 2 characters long',
  MAX_LEN_COUNTRY: 'Country name must not exceed 40 characters',
  COUNTRY_REQUIRED: 'Please select a country',
  COUNTRY_INVALID: 'Invalid country ID',
  COUNTRY_MATCH: 'Country name must contain only letters and spaces',
  REQUIRED_FLAG: 'Flag URL is required',
  OPTIONAL_PPL: 'Population is optional',
  PPL_MIN_LEN: 'Population cannot be negative',
  PPL_MAX_LEN: 'Population is unrealistically high',
  INTEGER_PPL: 'Population must be an integer',
  REGION_REQUIRED: 'Region is required',
  MIN_LEN_FNAME: 'First Name must be at least 2 characters long',
  MAX_LEN_FNAME: 'First Name must not exceed 50 characters',
  REQUIRED_FNAME: 'First Name is required',
  MIN_LEN_LNAME: 'Last Name must be at least 2 characters long',
  MAX_LEN_LNAME: 'Last Name must not exceed 50 characters',
  REQUIRED_LNAME: 'Last Name is required',
  MIN_LEN_USERNAME: 'Username must be at least 2 characters long',
  MAX_LEN_USERNAME: 'Username must not exceed 50 characters',
  REQUIRED_USERNAME: 'Username is required',
  UNIQUE_USERNAME: 'Username must be unique',
  REQUIRED_PHONE: 'Phone number is required',
  INVALID_PHONE: 'Phone number is invalid',
  REQUIRED_EMAIL: 'Email is required',
  INVALID_EMAIL: 'Email must be a valid format',
  UNIQUE_EMAIL: 'Email must be unique',
  REQUIRED_USER_ID: 'User ID is required',
  INVALID_USER_ID: 'User ID must be a valid ObjectId',

  REQUIRED_PERMISSION: 'Requested permission is required',
  INVALID_PERMISSION: 'Requested permission is not valid',

  INVALID_STATUS: 'Status must be a valid request status',
};
