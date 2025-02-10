import axios from 'axios';

const apiPort = import.meta.env.VITE_API_PORT;

export const client = axios.create({
  baseURL: `${apiPort}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});
