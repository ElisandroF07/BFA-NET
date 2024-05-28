import axios from 'axios';

const api = axios.create({
  baseURL: 'https://maximum-janith-franco07-5ccaf5a9.koyeb.app',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token'
  },
});

export default api;
