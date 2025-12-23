import api from './index';

export const paymentsService = {
    async getBalance(accountId) {
        const params = accountId ? { accountId } : {};
        const response = await api.get('/payments/balance', { params });
        return response.data;
    },

    async initPayment(amount, method, accountId) {
        const response = await api.post('/payments/init', { amount, method, accountId });
        return response.data;
    },

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

export const paymentService = paymentsService;
