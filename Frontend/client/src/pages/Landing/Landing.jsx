import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { 
  Phone, 
  Email, 
  LocationOn, 
  Home, 
  Business, 
  SupervisorAccount, 
  Payment, 
  History, 
  Notifications, 
  Speed, 
  Security, 
  Dashboard 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { announcementsService } from '../../api';
import {
  LandingContainer,
  BackgroundDecoration,
  HeroSection,
  HeroContainer,
  HeroContent,
  HeroImageContainer,
  HeroTitle,
  HeroSubtitle,
  HeroList,
  HeroListItem,
  HeroButtons,
  StyledAuthButton,
  LoginButton,
  Section,
  SectionTitle,
  GridSection,
  StepsGrid,
  FeatureCard,
  StepCard,
  StepNumber,
  NewsGrid,
  NewsCard,
  NewsDate,
  NewsContent,
  ContactGrid,
  ContactCard,
  IconWrapper,
  Footer,
  FooterContent,
  FooterLinks,
  FooterLink,
  AboutText
} from './Landing.styles';

const Landing = () => {
  const { openLogin, openRegister } = useAuth();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await announcementsService.getAll();
        const sortedNews = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setNews(sortedNews);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    fetchNews();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LandingContainer>
      <BackgroundDecoration />
      
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle variant="h1">
              Горизонт онлайн
            </HeroTitle>
            <HeroSubtitle variant="h5">
              Современный онлайн‑сервис для управления домом и оплаты ЖКХ.
            </HeroSubtitle>
            <HeroList>
              <HeroListItem>Оплачивайте счета без очередей и бумажек</HeroListItem>
              <HeroListItem>Передавайте показания за пару кликов</HeroListItem>
              <HeroListItem>Будьте в курсе объявлений и новостей дома</HeroListItem>
            </HeroList>
            <HeroButtons>
              <StyledAuthButton
                variant="contained"
                color="primary"
                size="large"
                onClick={openRegister}
              >
                Начать пользоваться
              </StyledAuthButton>
              <LoginButton
                variant="text"
                color="primary"
                size="large"
                onClick={openLogin}
              >
                Войти
              </LoginButton>
            </HeroButtons>
          </HeroContent>
          <HeroImageContainer>
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Modern House" />
          </HeroImageContainer>
        </HeroContainer>
      </HeroSection>

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

      <Section id="news">
        <SectionTitle variant="h4" component="h2">
          Новости и объявления
        </SectionTitle>
        <NewsGrid>
          {news.length > 0 ? (
            news.map((item) => (
              <NewsCard key={item.announcementId}>
                <NewsDate variant="caption" color="primary">
                  {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </NewsDate>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {item.title}
                </Typography>
                <NewsContent variant="body2" color="textSecondary">
                  {item.content}
                </NewsContent>
              </NewsCard>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ gridColumn: '1 / -1' }}>
              Пока нет новостей
            </Typography>
          )}
        </NewsGrid>
      </Section>

      <Section id="about">
        <SectionTitle variant="h4" component="h2">
          О нас
        </SectionTitle>
        <AboutText variant="body1" paragraph align="center">
          Мы объединяем жителей и управляющую компанию, делая взаимодействие прозрачным и удобным.
          Наша цель — создать комфортную среду для жизни, где все бытовые вопросы решаются в несколько кликов.
        </AboutText>
      </Section>

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

      <Footer>
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
            <FooterLink onClick={() => scrollToSection('about')}>О нас</FooterLink>
            <FooterLink onClick={() => scrollToSection('contacts')}>Контакты</FooterLink>
            <FooterLink href="#">Политика конфиденциальности</FooterLink>
          </FooterLinks>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Горизонт онлайн. Все права защищены.
          </Typography>
        </FooterContent>
      </Footer>
    </LandingContainer>
  );
};

export default Landing;
