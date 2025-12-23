import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab } from '@mui/material';

export const PageContainer = styled('div')(({ theme }) => ({
    minHeight: '100%',
    background: theme.custom.gradients.mainBg,
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '20px 10px',
    },
}));

export const PageContent = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
        height: 3,
        borderRadius: '3px 3px 0 0',
    },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

export const TabPanel = styled(Box)(({ theme }) => ({
    animation: 'fadeIn 0.3s ease-out',
    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
            transform: 'translateY(10px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));
