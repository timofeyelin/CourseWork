import api from './index';

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
