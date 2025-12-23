import api from './index';

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
