import { styled } from '@mui/material/styles';
import { Paper, Button, TextField, Dialog, DialogTitle, DialogActions, IconButton } from '@mui/material';

export const GlassCard = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: theme.custom.glass.border,
    boxShadow: theme.custom.glass.shadow,
    borderRadius: '16px',
}));

export const GlassButton = styled(Button)(({ theme, variant, color }) => {
    const isPrimary = variant === 'contained' && (!color || color === 'primary');
    const isError = color === 'error';
    const isSecondary = !variant || variant === 'text';

    if (isError) {
        return {
            background: theme.palette.error.main,
            color: 'white',
            padding: '10px 24px',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)',
            transition: 'all 0.3s',
            '&:hover': {
                background: '#c62828',
                boxShadow: '0 6px 20px rgba(198, 40, 40, 0.4)',
                transform: 'translateY(-2px)',
            },
            '&:focus, &:focus-visible': {
                outline: 'none',
            },
        };
    }

    if (isPrimary) {
        return {
            background: theme.palette.primary.main,
            color: 'white',
            padding: '10px 24px',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(2, 136, 209, 0.3)',
            transition: 'all 0.3s',
            '&:hover': {
                background: theme.palette.primary.dark,
                boxShadow: '0 6px 20px rgba(2, 119, 189, 0.4)',
                transform: 'translateY(-2px)',
            },
            '&:focus, &:focus-visible': {
                outline: 'none',
            },
        };
    }

    if (isSecondary) {
        return {
            color: theme.palette.text.secondary,
            textTransform: 'none',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '10px 24px',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&:focus, &:focus-visible': {
                outline: 'none',
            },
        };
    }

    return {};
});

export const GlassIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(2, 136, 209, 0.1)',
    marginLeft: '8px',
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: 'rgba(2, 136, 209, 0.2)',
        transform: 'translateY(-2px)',
    },
    '&:focus, &:focus-visible': {
        outline: 'none',
    },
}));

export const GlassInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '12px',
        borderColor: theme.palette.divider,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '0.95rem',
    },
    '& .MuiOutlinedInput-input::placeholder': {
        fontSize: '0.9rem',
    },
}));

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

export const StatusPill = styled('span')(({ theme, status }) => {
    let background = 'gray';
    let boxShadow = 'none';

    switch (status) {
        case 'paid':
        case 'Paid':
            background = 'linear-gradient(135deg, #43a047, #2e7d32)';
            boxShadow = '0 4px 10px rgba(46, 125, 50, 0.2)';
            break;
        case 'unpaid':
        case 'Unpaid':
            background = 'linear-gradient(135deg, #e53935, #c62828)';
            boxShadow = '0 4px 10px rgba(198, 40, 40, 0.2)';
            break;
        case 'pending':
        case 'Pending':
            background = 'linear-gradient(135deg, #FFB74D, #F57C00)';
            boxShadow = '0 4px 10px rgba(245, 124, 0, 0.2)';
            break;
        case 'cancelled':
        case 'Cancelled':
            background = 'linear-gradient(135deg, #90A4AE, #607D8B)';
            boxShadow = '0 4px 10px rgba(96, 125, 139, 0.2)';
            break;
        default:
            break;
    }

    return {
        padding: '8px 16px',
        borderRadius: '30px',
        fontWeight: 600,
        fontSize: '0.8rem',
        display: 'inline-flex',
        alignItems: 'center',
        border: 'none',
        color: 'white',
        background,
        boxShadow,
    };
});
