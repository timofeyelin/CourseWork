import { Typography } from '@mui/material';
import { 
    Section, 
    SectionTitle, 
    StepsGrid, 
    StepCard, 
    StepNumber 
} from '../Landing.styles';

const HowItWorks = () => {
    return (
        <Section id="how-it-works">
            <SectionTitle variant="h4" component="h2">
                Как это работает
            </SectionTitle>
            <StepsGrid>
                <StepCard>
                    <StepNumber>1</StepNumber>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Регистрация</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Регистрируетесь в системе за пару минут
                    </Typography>
                </StepCard>
                <StepCard>
                    <StepNumber>2</StepNumber>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Лицевой счёт</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Добавляете лицевой счёт или адрес дома
                    </Typography>
                </StepCard>
                <StepCard>
                    <StepNumber>3</StepNumber>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Показания и оплата</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Передаёте показания и оплачиваете квитанции
                    </Typography>
                </StepCard>
                <StepCard>
                    <StepNumber>4</StepNumber>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Уведомления</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Получаете новости от управляющей компании
                    </Typography>
                </StepCard>
            </StepsGrid>
        </Section>
    );
};

export default HowItWorks;
