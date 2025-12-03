import { styled } from '@mui/material/styles';
import { Box, Typography, Container } from '@mui/material';
import { GlassCard, GlassButton } from '../../components/common';

export const LandingContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.custom.gradients.mainBg,
  position: 'relative',
  overflow: 'hidden',
}));

export const BackgroundDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  pointerEvents: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(2, 136, 209, 0.15) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255, 152, 0, 0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
  }
}));

export const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 2, 8),
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
}));

export const HeroContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1000px !important',
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  fontSize: '3.5rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  maxWidth: '600px',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  fontSize: '1.25rem',
  lineHeight: 1.6,
}));

export const HeroButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

export const StyledAuthButton = styled(GlassButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  minWidth: '160px',
}));

export const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 2),
  maxWidth: '1000px',
  margin: '0 auto',
  width: '100%',
  position: 'relative',
  zIndex: 1,
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  fontWeight: 800,
  color: theme.palette.text.primary,
  position: 'relative',
  '&::after': {
    content: '""',
    display: 'block',
    width: '60px',
    height: '4px',
    background: theme.palette.primary.main,
    margin: '16px auto 0',
    borderRadius: '2px',
  }
}));

export const NewsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: theme.spacing(4),
}));

export const NewsCard = styled(GlassCard)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

export const NewsDate = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const NewsContent = styled(Typography)(({ theme }) => ({
  lineHeight: 1.6,
}));

export const ContactGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(4),
  justifyContent: 'center',
}));

export const ContactCard = styled(GlassCard)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, rgba(255,255,255,0.5) 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  '& svg': {
    fontSize: '30px',
  }
}));

export const Footer = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(4, 2),
  background: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.3)',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
}));

export const AboutText = styled(Typography)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  fontSize: '1.1rem',
  lineHeight: 1.8,
  color: theme.palette.text.secondary,
}));

export const NoNewsText = styled(Typography)(({ theme }) => ({
  gridColumn: '1 / -1',
  padding: theme.spacing(4),
  background: 'rgba(255,255,255,0.3)',
  borderRadius: '16px',
}));
