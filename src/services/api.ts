import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bfa-nodejs-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token'
  },
});

export default api;
