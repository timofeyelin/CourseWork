import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { GlassCard } from '../common';

export const ModalCard = styled(GlassCard)(({ theme }) => ({
    padding: theme.spacing(4),
    margin: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
}));

export const Header = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const Content = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

export const Text = styled(Typography)(({ theme }) => ({
    whiteSpace: 'pre-wrap',
    lineHeight: 1.8,
}));

export const Actions = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
}));
