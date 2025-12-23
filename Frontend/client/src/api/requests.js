import api from './index';

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
