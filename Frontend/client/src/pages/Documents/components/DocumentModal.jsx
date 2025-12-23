import React, { useEffect, useState } from 'react';
import { 
    DialogContent, 
    Box, 
    Typography,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../../components/common';
import { API_BASE_URL } from '../../../utils/constants';
import { styled } from '@mui/material/styles';

const PreviewContainer = styled(Box)({
    width: '100%',
    height: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    borderRadius: '12px',
    overflow: 'hidden',
    marginTop: '16px',
});

const PreviewImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
});

const PreviewFrame = styled('iframe')({
    width: '100%',
    height: '100%',
    border: 'none',
});

const DocumentModal = ({ open, onClose, document, onDownload }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewError, setPreviewError] = useState(null);

    const isImage = document?.type?.includes('image') || document?.type?.includes('jpg') || document?.type?.includes('png');
    const isPdf = document?.type?.includes('pdf');

    useEffect(() => {
        let url = null;
        const controller = new AbortController();

        const loadPreview = async () => {
            try {
                if (!open || !document || !(isImage || isPdf)) return;
                const token = localStorage.getItem('accessToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resp = await fetch(`${API_BASE_URL}/documents/${document.id}/download`, {
                    method: 'GET',
                    headers,
                    signal: controller.signal
                });
                if (!resp.ok) {
                    const text = await resp.text().catch(() => resp.statusText);
                    const msg = `${resp.status} ${resp.statusText}${text ? ` - ${text}` : ''}`;
                    console.warn('Preview fetch failed', msg);
                    setPreviewError(msg);
                    return;
                }
                const blob = await resp.blob();
                url = URL.createObjectURL(blob);
                setPreviewUrl(url);
            } catch (e) {
                if (e.name === 'AbortError') return;
                console.error('Error loading preview', e);
                setPreviewError(e.message || String(e));
            }
        };

        loadPreview();

        return () => {
            controller.abort();
            if (url) {
                URL.revokeObjectURL(url);
            }
            setPreviewUrl(null);
            setPreviewError(null);
        };
    }, [open, document?.id, isImage, isPdf]);

    const renderPreview = () => {
        if (previewError) {
            return (
                <Box textAlign="center" p={3}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Не удалось загрузить превью
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {previewError}
                    </Typography>
                </Box>
            );
        }

        if (isImage) {
            return <PreviewImage src={previewUrl || document?.file_url} alt={document?.title} />;
        }
        if (isPdf) {
            return <PreviewFrame src={previewUrl || document?.file_url} title={document?.title} />;
        }
        return (
            <Box textAlign="center" p={3}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    Предпросмотр недоступен
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Файл этого формата нельзя просмотреть в браузере.
                    Пожалуйста, скачайте его.
                </Typography>
            </Box>
        );
    };

    if (!document) return null;

    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <GlassDialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="span" fontWeight="bold">
                        {document.title}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </GlassDialogTitle>
            
            <DialogContent>
                <PreviewContainer>
                    {renderPreview()}
                </PreviewContainer>
            </DialogContent>

            <GlassDialogActions>
                <GlassButton 
                    onClick={() => onDownload(document)}
                    variant="contained"
                    startIcon={<DownloadIcon />}
                >
                    Скачать
                </GlassButton>
                <GlassButton 
                    onClick={onClose}
                    variant="text"
                >
                    Закрыть
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default DocumentModal;
