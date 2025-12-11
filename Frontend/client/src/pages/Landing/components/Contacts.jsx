import { Typography } from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import { 
    Section, 
    SectionTitle, 
    ContactGrid, 
    ContactCard, 
    IconWrapper 
} from '../Landing.styles';

const Contacts = () => {
    return (
        <Section id="contacts">
            <SectionTitle variant="h4" component="h2">
                Контакты
            </SectionTitle>
            <ContactGrid>
                <ContactCard elevation={0}>
                    <IconWrapper>
                        <Phone />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Телефон</Typography>
                    <Typography variant="body1" color="primary">+7 (999) 123-45-67</Typography>
                    <Typography variant="body2" color="textSecondary">Круглосуточно</Typography>
                </ContactCard>
                
                <ContactCard elevation={0}>
                    <IconWrapper>
                        <Email />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Email</Typography>
                    <Typography variant="body1" color="primary">support@horizon-online.ru</Typography>
                    <Typography variant="body2" color="textSecondary">По общим вопросам</Typography>
                </ContactCard>
                
                <ContactCard elevation={0}>
                    <IconWrapper>
                        <LocationOn />
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom fontWeight="bold">Адрес</Typography>
                    <Typography variant="body1" color="textPrimary">г. Москва, ул. Примерная, д. 1</Typography>
                    <Typography variant="body2" color="textSecondary">Пн-Пт: 9:00 - 18:00</Typography>
                </ContactCard>
            </ContactGrid>
        </Section>
    );
};

export default Contacts;
