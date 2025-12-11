import { Box, Typography } from '@mui/material';
import { 
    Footer as StyledFooter, 
    FooterContent, 
    FooterLinks, 
    FooterLink 
} from '../Landing.styles';

const Footer = ({ onScrollToSection }) => {
    return (
        <StyledFooter>
            <FooterContent>
                <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        Горизонт онлайн
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Современный сервис для вашего дома
                    </Typography>
                </Box>
                <FooterLinks>
                    <FooterLink onClick={() => onScrollToSection('about')}>О нас</FooterLink>
                    <FooterLink onClick={() => onScrollToSection('contacts')}>Контакты</FooterLink>
                    <FooterLink href="#">Политика конфиденциальности</FooterLink>
                </FooterLinks>
                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} Горизонт онлайн. Все права защищены.
                </Typography>
            </FooterContent>
        </StyledFooter>
    );
};

export default Footer;
