import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Перехватчик для добавления токена авторизации ко всем запросам
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    async register(userData) {
        return await api.post('/auth/register', userData);
    },

    async login(email, password) {
        const response = await api.post('/auth/login', { emailOrPhone: email, password });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
};

export const userService = {
    async getProfile() {
        return await api.get('/user/profile');
    },

    async getAccounts() {
        return await api.get('/user/accounts');
    },

    async addAccount(accountNumber) {
        return await api.post('/user/accounts', { accountNumber });
    },

    async deleteAccount(accountId) {
        return await api.delete(`/user/accounts/${accountId}`);
    }
};

export const billsService = {
    async getBills(params) {
        return await api.get('/bills', { params });
    },

    async getBillPdf(billId) {
        return await api.get(`/bills/${billId}/pdf`, { responseType: 'blob' });
    },

    async payBill(paymentData) {
        return await api.post('/payments', paymentData);
    }
};

export default api;