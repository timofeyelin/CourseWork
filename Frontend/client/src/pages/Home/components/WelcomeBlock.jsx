import { Typography } from '@mui/material';
import { WelcomeSection, WelcomeTitle } from '../Home.styles';

const WelcomeBlock = () => {
    return (
        <WelcomeSection>
            <WelcomeTitle variant='h4' component='h1'>
                Добро пожаловать!
            </WelcomeTitle>
            <Typography variant='body1' color="text.secondary">
                Обзор вашего лицевого счета и новости УК
            </Typography>
        </WelcomeSection>
    );
};

export default WelcomeBlock;
