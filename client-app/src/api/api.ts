import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Attach JWT token to every request if it exists in localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optionally, handle global errors here
api.interceptors.response.use(
  response => response,
  error => {
    // You can handle 401/403 globally here if needed
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Unauthorized or Forbidden. Redirect to login if needed.');
    }
    return Promise.reject(error);
  }
);

export default api;
