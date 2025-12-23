import api from './index';

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
    },

    async updateProfile(data) {
        return await api.put('/user/profile', data);
    }
};
