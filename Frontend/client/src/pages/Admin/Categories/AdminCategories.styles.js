import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { GlassCard } from '../../../components/common';

export const PageContainer = styled('div')(({ theme }) => ({
    minHeight: '100%',
    background: theme.custom.gradients.mainBg,
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '20px 10px',
    },
}));

export const PageCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '800px', // Для списка категорий не нужно очень широко
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '600px',
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
    padding: '2rem 3rem',
    borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.4)',
}));

export const ContentSection = styled(Box)(({ theme }) => ({
    padding: '2rem 3rem',
}));

export const CategoryList = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const CategoryItem = styled(GlassCard)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transition: 'transform 0.2s, background-color 0.2s',
    '&:hover': {
        transform: 'translateX(5px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.error.main,
    '&:hover': {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
    }
}));