import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant='h3' component='h1' gutterBottom>
                    Личный кабинет жителя
                </Typography>
                <Typography variant='body1'>
                    Главная страница
                </Typography>
            </Box>
        </Container>
    );
}

export default Home;