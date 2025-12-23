import React from 'react';
import { Box, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

const Container = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3),
    flex: 1,
}));

const Card = styled(GlassCard)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: 720,
    width: '100%',
    textAlign: 'center',
    borderRadius: 14,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

const ErrorBox = ({ message = 'Произошла ошибка', onRetry = null, retryLabel = 'Повторить' }) => {
    return (
        <Container>
            <Card elevation={2}>
                <Typography color="error" variant="h6" sx={{ fontWeight: 700 }}>
                    {message}
                </Typography>
                <Subtitle variant="body2">Попробуйте ещё раз или обратитесь в поддержку, если ошибка повторяется.</Subtitle>

                {onRetry && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <GlassButton variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={onRetry}>
                            {retryLabel}
                        </GlassButton>
                    </Box>
                )}
            </Card>
        </Container>
    );
};

export default ErrorBox;
