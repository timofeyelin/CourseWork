import { Typography } from '@mui/material';
import { Home, Business, SupervisorAccount } from '@mui/icons-material';
import { 
    Section, 
    SectionTitle, 
    GridSection, 
    FeatureCard, 
    IconWrapper 
} from '../Landing.styles';

const TargetAudience = () => {
    return (
        <Section id="for-whom">
            <SectionTitle variant="h4" component="h2">
                Для кого подходит «Горизонт онлайн»
            </SectionTitle>
            <GridSection>
                <FeatureCard>
                    <IconWrapper>
                        <Home />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Жителям дома</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Оплата квитанций, передача показаний, обращения в УК
                    </Typography>
                </FeatureCard>
                <FeatureCard>
                    <IconWrapper>
                        <Business />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Управляющим компаниям</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Прозрачное общение с жильцами, быстрый сбор данных
                    </Typography>
                </FeatureCard>
                <FeatureCard>
                    <IconWrapper>
                        <SupervisorAccount />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Старшим по дому</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Уведомления, объявления и контроль заявок
                    </Typography>
                </FeatureCard>
            </GridSection>
        </Section>
    );
};

export default TargetAudience;
