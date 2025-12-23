import api from './index';

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
