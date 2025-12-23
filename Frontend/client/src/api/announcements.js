import api from './index';

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
