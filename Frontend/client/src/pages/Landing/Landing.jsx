import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { announcementsService } from '../../api';
import { LandingContainer, BackgroundDecoration } from './Landing.styles';
import Hero from './components/Hero';
import TargetAudience from './components/TargetAudience';
import HowItWorks from './components/HowItWorks';
import Advantages from './components/Advantages';
import NewsPreview from './components/NewsPreview';
import About from './components/About';
import Contacts from './components/Contacts';
import Footer from './components/Footer';

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
      
      <Hero openLogin={openLogin} openRegister={openRegister} />

      <TargetAudience />

      <HowItWorks />

      <Advantages />

      <NewsPreview news={news} />

      <About />

      <Contacts />

      <Footer onScrollToSection={scrollToSection} />
    </LandingContainer>
  );
};

export default Landing;
