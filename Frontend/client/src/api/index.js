import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

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

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._isRetry = true;
            isRefreshing = true;

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
                
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api.request(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);

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
            } finally {
                isRefreshing = false;
            }
        }
        // Если это не 401 или уже пробовали обновить — возвращаем ошибку
        return Promise.reject(error);
    }
);

export * from './auth';
export * from './user';
export * from './bills';
export * from './payments';
export * from './requests';
export * from './announcements';
export * from './notifications';
export * from './admin';
export * from './meters';
export * from './documents';


export default api;