import axios from 'axios';

const API_BASE_URL = 'https://cinesearch-backend-1h9k.onrender.com/api'; // Android emülatör için localhost

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
