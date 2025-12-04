import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import { announcementsService } from '../../api';
import LoginModal from '../../components/Modals/LoginModal';
import RegisterModal from '../../components/Modals/RegisterModal';
import NewsModal from '../../components/Modals/NewsModal';
import {
  LandingContainer,
  BackgroundDecoration,
  HeroSection,
  HeroContainer,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  StyledAuthButton,
  Section,
  SectionTitle,
  NewsGrid,
  NewsCard,
  NewsDate,
  NewsContent,
  ContactGrid,
  ContactCard,
  IconWrapper,
  Footer,
  AboutText,
  NoNewsText
} from './Landing.styles';

const Landing = () => {
  const [news, setNews] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsModalOpen, setNewsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await announcementsService.getAll();
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };
    fetchNews();
  }, []);

  const handleLoginOpen = () => {
    setLoginOpen(true);
    setRegisterOpen(false);
  };

  const handleRegisterOpen = () => {
    setRegisterOpen(true);
    setLoginOpen(false);
  };

  const handleClose = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleNewsClick = (item) => {
    setSelectedNews(item);
    setNewsModalOpen(true);
  };

  const handleNewsClose = () => {
    setNewsModalOpen(false);
    setTimeout(() => setSelectedNews(null), 300);
  };

  return (
    <LandingContainer>
      <BackgroundDecoration />
      
      <HeroSection>
        <HeroContainer maxWidth={false}>
          <HeroTitle variant="h1">
            Горизонт онлайн
          </HeroTitle>
          <HeroSubtitle variant="h5">
            Современный сервис для комфортного управления вашим домом. 
            Оплачивайте счета, передавайте показания и будьте в курсе событий.
          </HeroSubtitle>
          <HeroButtons>
            <StyledAuthButton
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLoginOpen}
            >
              Войти
            </StyledAuthButton>
            <StyledAuthButton
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleRegisterOpen}
            >
              Регистрация
            </StyledAuthButton>
          </HeroButtons>
        </HeroContainer>
      </HeroSection>

      <Section>
        <SectionTitle variant="h4" component="h2">
          О нас
        </SectionTitle>
        <AboutText variant="body1" paragraph align="center">
          Мы предоставляем инновационные решения для сферы ЖКХ.
          Наша платформа объединяет жителей и управляющую компанию, делая взаимодействие прозрачным и эффективным.
          Забудьте о очередях и бумагах — всё, что нужно для вашего дома, теперь в одном клике.
        </AboutText>
      </Section>

      <Section>
        <SectionTitle variant="h4" component="h2">
          Новости и объявления
        </SectionTitle>
        <NewsGrid>
          {news.length > 0 ? (
            news.map((item) => (
              <NewsCard 
                key={item.announcementId} 
                elevation={0}
                onClick={() => handleNewsClick(item)}
              >
                <Typography variant="h6" component="h3" gutterBottom color={item.isEmergency ? 'error' : 'textPrimary'} fontWeight="bold">
                  {item.title}
                </Typography>
                <NewsDate variant="caption" color="textSecondary" display="block" gutterBottom>
                  {new Date(item.createdAt).toLocaleDateString()}
                </NewsDate>
                <NewsContent variant="body2" color="textSecondary">
                  {item.content.length > 150 ? `${item.content.substring(0, 150)}...` : item.content}
                </NewsContent>
              </NewsCard>
            ))
          ) : (
            <NoNewsText align="center" color="textSecondary">
              Нет актуальных новостей
            </NoNewsText>
          )}
        </NewsGrid>
      </Section>

      <Section>
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

      <Footer>
        <Typography variant="body2">
          © {new Date().getFullYear()} Горизонт онлайн. Все права защищены.
        </Typography>
      </Footer>

      <LoginModal
        open={loginOpen}
        onClose={handleClose}
        onSwitchToRegister={handleRegisterOpen}
      />
      <RegisterModal
        open={registerOpen}
        onClose={handleClose}
        onSwitchToLogin={handleLoginOpen}
      />
      <NewsModal
        open={newsModalOpen}
        onClose={handleNewsClose}
        newsItem={selectedNews}
      />
    </LandingContainer>
  );
};

export default Landing;
