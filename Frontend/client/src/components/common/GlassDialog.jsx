import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';

export const GlassDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflowX: 'hidden',
    },
    '& .MuiDialogContent-root': {
        overflowX: 'hidden',
        padding: '20px 0',
    },
}));

export const GlassDialogTitle = styled(DialogTitle)(({ theme }) => ({
    fontWeight: '800',
    color: theme.palette.text.primary,
    fontSize: '1.75rem',
    padding: '0 0 1rem 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
}));

export const GlassDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: '1rem 0 0 0',
    gap: '1rem',
    justifyContent: 'flex-end',
}));
