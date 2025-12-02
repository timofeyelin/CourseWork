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

    async getBillDetails(billId) {
        return await api.get(`/bills/${billId}`);
    },

    async getBillPdf(billId) {
        return await api.get(`/bills/${billId}/pdf`, { responseType: 'blob' });
    },

    async payBill(paymentData) {
        return await api.post('/payments', paymentData);
    }
};

export const paymentsService = {
    async getHistory(params) {
        return await api.get('/payments/mine', { params });
    },

    async markAsPaid(paymentId) {
        return await api.post(`/payments/${paymentId}/mark-paid`);
    },

    async cancelPayment(paymentId) {
        return await api.post(`/payments/${paymentId}/cancel`);
    }
};

export const requestsService = {
    async getUserRequests() {
        return await api.get('/requests');
    },

    async getRequestDetails(requestId) {
        return await api.get(`/requests/${requestId}`);
    },

    async createRequest(requestData) {
        return await api.post('/requests', requestData);
    },

    async addComment(requestId, commentData) {
        return await api.post(`/requests/${requestId}/comments`, commentData);
    },

    async rateRequest(requestId, ratingData) {
        return await api.post(`/requests/${requestId}/rate`, ratingData);
    },

    async uploadAttachment(requestId, file) {
        const formData = new FormData();
        formData.append('file', file);
        return await api.post(`/requests/${requestId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export const announcementsService = {
    async getAll() {
        return await api.get('/announcements');
    },

    async getUnread() {
        return await api.get('/announcements/unread');
    },

    async markAsRead(announcementId) {
        return await api.post(`/announcements/${announcementId}/mark-read`);
    }
};

export default api;