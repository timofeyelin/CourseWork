import api from './index';

export const documentsService = {
    async getAll(type = '') {
        const params = type && type !== 'all' ? { type } : {};
        const response = await api.get('/documents', { params });
        return response.data;
    },

    async download(documentId) {
        const response = await api.get(`/documents/${documentId}/download`, {
            responseType: 'arraybuffer'
        });
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        let filename = null;
        const cd = response.headers['content-disposition'] || response.headers['Content-Disposition'];
        if (cd) {
            const match = /filename\*=UTF-8''([^;\n]+)/i.exec(cd) || /filename="?([^";\n]+)"?/i.exec(cd);
            if (match) {
                try {
                    filename = decodeURIComponent(match[1]);
                } catch (e) {
                    filename = match[1];
                }
            }
        }

        const blob = new Blob([response.data], { type: contentType });
        return { blob, filename };
    }
};
