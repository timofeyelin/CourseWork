import { Typography } from '@mui/material';
import { WelcomeSection, WelcomeTitle } from '../Home.styles';
import { useAuth } from '../../../context/AuthContext';

const WelcomeBlock = () => {
    const { user } = useAuth();

    let subtitle = 'Обзор вашего лицевого счета и новости УК';
    if (user?.role === 'Operator') subtitle = 'Управление заявками и событиями';
    if (user?.role === 'Admin') subtitle = 'Управление реестром жителей и финансовая аналитика';

    return (
        <WelcomeSection>
            <WelcomeTitle variant='h4' component='h1'>
                Добро пожаловать!
            </WelcomeTitle>
            <Typography variant='body1' color="text.secondary">
                {subtitle}
            </Typography>
        </WelcomeSection>
    );
};

export default WelcomeBlock;
