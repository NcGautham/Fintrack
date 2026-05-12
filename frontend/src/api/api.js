import axios from 'axios';

const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_BASE_URL = raw.replace(/\/+$/, '');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

// Stock APIs
export const stockAPI = {
    getAll: () => api.get('/stocks'),
    getById: (id) => api.get(`/stocks/${id}`),
    create: (stock) => api.post('/stocks', stock),
    update: (id, stock) => api.put(`/stocks/${id}`, stock),
    delete: (id) => api.delete(`/stocks/${id}`),
};

// SIP APIs
export const sipAPI = {
    getAll: () => api.get('/sips'),
    getById: (id) => api.get(`/sips/${id}`),
    create: (sip) => api.post('/sips', sip),
    update: (id, sip) => api.put(`/sips/${id}`, sip),
    delete: (id) => api.delete(`/sips/${id}`),
};

// Transaction APIs
export const transactionAPI = {
    getAll: () => api.get('/transactions'),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (transaction) => api.post('/transactions', transaction),
    update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
    delete: (id) => api.delete(`/transactions/${id}`),
};

// Dashboard API
export const dashboardAPI = {
    getSummary: () => api.get('/dashboard'),
};

export default api;
