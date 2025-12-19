import api from './index';

export const paymentService = {
    async getBalance() {
        const response = await api.get('/payments/balance');
        return response.data;
    },

    async initPayment(amount, method) {
        const response = await api.post('/payments/init', { amount, method });
        return response.data;
    }
};
