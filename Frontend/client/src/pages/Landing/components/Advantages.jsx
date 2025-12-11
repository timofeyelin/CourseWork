import { Typography } from '@mui/material';
import { Payment, History, Notifications, Speed, Security, Dashboard } from '@mui/icons-material';
import { 
    Section, 
    SectionTitle, 
    GridSection, 
    FeatureCard, 
    IconWrapper 
} from '../Landing.styles';

const Advantages = () => {
    return (
        <Section id="advantages">
            <SectionTitle variant="h4" component="h2">
                Преимущества сервиса
            </SectionTitle>
            <GridSection>
                <FeatureCard>
                    <IconWrapper><Payment /></IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Онлайн-оплата</Typography>
                    <Typography variant="body2" color="textSecondary">Без очередей и комиссий</Typography>
                </FeatureCard>
                <FeatureCard>
                    <IconWrapper><History /></IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">История платежей</Typography>
                    <Typography variant="body2" color="textSecondary">Все квитанции в одном месте</Typography>
                </FeatureCard>
                <FeatureCard>
                    <IconWrapper><Notifications /></IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Напоминания</Typography>
                    <Typography variant="body2" color="textSecondary">О сроках оплаты и поверки</Typography>
                </FeatureCard>
                <FeatureCard>
                    <IconWrapper><Speed /></IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Быстро</Typography>
                    <Typography variant="body2" color="textSecondary">Передача показаний без звонков</Typography>
                </FeatureCard>
                <FeatureCard>
                    <IconWrapper><Security /></IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Надежно</Typography>
                    <Typography variant="body2" color="textSecondary">Защита ваших персональных данных</Typography>
                </FeatureCard>
                <FeatureCard>
                    <IconWrapper><Dashboard /></IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Удобно</Typography>
                    <Typography variant="body2" color="textSecondary">Понятный интерфейс для всех</Typography>
                </FeatureCard>
            </GridSection>
        </Section>
    );
};

export default Advantages;
