import axios from 'axios';

const api = axios.create({
  baseURL: 'https://environmental-kristina-franco07-98c1a6b0.koyeb.app/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token'
  },
});

export default api;
