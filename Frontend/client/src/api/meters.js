import api from './index';

export const metersService = {
    async getAll() {
        const response = await api.get('/meters');
        return response.data;
    },

    async getByAccount(accountId) {
        const response = await api.get(`/meters/account/${accountId}`);
        return response.data;
    },

    async getHistory(meterId) {
        const response = await api.get(`/meters/${meterId}/readings`);
        return response.data;
    },

    async submitReading(meterId, data) {
        const response = await api.post(`/meters/${meterId}/readings`, data);
        return response.data;
    }
};
