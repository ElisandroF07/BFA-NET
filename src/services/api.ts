import axios from 'axios';

const api = axios.create({
  baseURL: 'https://civic-rivy-franco07-c3b34b79.koyeb.app/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token'
  },
});

export default api;
