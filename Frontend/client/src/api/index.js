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

// Перехватчик для обработки ошибок ответов (например, 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
            // Не пытаемся обновить токен, если ошибка произошла при попытке входа
            if (originalRequest.url.includes('/auth/login')) {
                return Promise.reject(error);
            }

            originalRequest._isRetry = true;

            try {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });

                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;


                return api.request(originalRequest);

                } catch (refreshError) {

                console.log("Сессия истекла или ошибка обновления токена");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // Триггерим событие, которое обработает навигацию внутри SPA
                try {
                    window.dispatchEvent(new CustomEvent('auth:expired'));
                } catch (e) {
                    // fallback: если CustomEvent не поддерживается, делаем полную навигацию
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            }
        }
        // Если это не 401 или уже пробовали обновить — возвращаем ошибку
        return Promise.reject(error);
    }
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
    ,
    async updateProfile(data) {
        return await api.put('/user/profile', data);
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

    async getCategories() {
        return await api.get('/categories');
    },

    async createCategory(name) {
        return await api.post('/categories', { name });
    },

    async deleteCategory(id) {
        return await api.delete(`/categories/${id}`);
    },

    async uploadAttachment(requestId, file) {
        const formData = new FormData();
        formData.append('file', file);
        return await api.post(`/requests/${requestId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    async getOperatorRequests(params) {
        return await api.get('/operator/requests', { params });
    },

    async updateOperatorRequest(requestId, data) {
        return await api.patch(`/operator/requests/${requestId}`, data);
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
    },

    async create(data) {
        return await api.post('/announcements', data);
    },
    async update(id, data) {
        return await api.put(`/announcements/${id}`, data);
    },
    async delete(id) {
        return await api.delete(`/announcements/${id}`);
    }
};

export const notificationsService = {
    async getAll() {
        return await api.get('/notifications');
    },

    async markAllAsRead() {
        return await api.post('/notifications/mark-read');
    },

    async markAsRead(notificationId) {
        return await api.post(`/notifications/${notificationId}/mark-read`);
    }
};

export const adminService = {
    async getUsers(query) {
        return await api.get('/admin/users', { params: { q: query } });
    },

    async blockUser(userId, isActive) {
        return await api.post('/admin/users/block', { userId, isActive });
    },

    async changeRole(userId, newRole) {
        return await api.post('/admin/users/change-role', { userId, newRole });
    },

    async linkAccount(userId, accountNumber) {
        return await api.post('/admin/users/link-account', { userId, accountNumber });
    },

    async unlinkAccount(userId, accountId) {
        return await api.post('/admin/users/unlink-account', { userId, accountId });
    },

    async getAnalytics(params) {
         return await api.get('/admin/analytics', { params });
    },
    async createAccount(data) {
        return await api.post('/admin/create-account', data);
    },
    async addMeter(accountNumber, type, serialNumber) {
        return await api.post('/admin/add-meter', null, {
            params: {
                accountNumber,
                type,
                serialNumber
            }
        });
    }
    ,
    async generateBillsNow(period, force = false) {
        const params = {};
        if (period) params.period = period;
        if (force) params.force = true;
        return await api.post('/admin/generate-bills-now', null, { params });
    },

    async getAuditLogs(page = 1, pageSize = 20, fromDate = null, toDate = null, search = null) {
        const params = { page, pageSize };
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;
        if (search) params.search = search;
        return await api.get('/admin/audit', { params });
    },

    async importBills(data) {
        // data - это массив объектов (JSON)
        return await api.post('/admin/import/bills', data);
    }
};


export default api;