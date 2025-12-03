import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const GlassCard = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: theme.custom.glass.border,
    boxShadow: theme.custom.glass.shadow,
    borderRadius: '16px',
}));
