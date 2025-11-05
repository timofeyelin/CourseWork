import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Login = () => {
    return (
        <Container maxWidth='sm'>
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component='h1' variant='h5' align='center'>
                        Вход в личный кабинет
                    </Typography>
                    <Typography sx={{ mt: 2}} align='center' color='text.secondary'>
                        Форма входа будет реализована позже
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login;