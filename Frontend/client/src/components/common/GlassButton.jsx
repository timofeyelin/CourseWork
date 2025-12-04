import { styled } from '@mui/material/styles';
import { Button, IconButton } from '@mui/material';

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
