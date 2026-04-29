import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://dromoney.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('dromoney_token');
        const adminToken = localStorage.getItem('dromoney_admin_token');
        
        // Use admin token if the request path starts with /admin
        if (config.url.includes('/admin') && adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        } else if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.error || 'Something went wrong';
        const status = error.response?.status;
        console.error('API Error:', message);
        return Promise.reject({ message, status });
    }
);

export default api;
