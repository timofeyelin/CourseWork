import { styled } from '@mui/material/styles';
import { Box, Typography, Container, Link } from '@mui/material';
import { GlassCard, GlassButton } from '../../components/common';

export const LandingContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.custom.gradients.mainBg,
  position: 'relative',
  overflowX: 'hidden',
}));

export const BackgroundDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-200px',
    right: '-100px',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(2, 136, 209, 0.15) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-200px',
    left: '-100px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255, 152, 0, 0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
  }
}));

export const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 6, 8),
  position: 'relative',
  zIndex: 1,
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(12, 3, 8),
  },
}));

export const HeroContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    textAlign: 'center',
  },
}));

export const HeroContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
  },
}));

export const HeroImageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: '500px',
  },
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  fontSize: '3.5rem',
  lineHeight: 1.2,
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  fontSize: '1.25rem',
  lineHeight: 1.6,
}));

export const HeroList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: `0 0 ${theme.spacing(4)} 0`,
  textAlign: 'left',
}));

export const HeroListItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  fontSize: '1.1rem',
  color: theme.palette.text.primary,
  '&::before': {
    content: '"•"',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginRight: theme.spacing(1.5),
    lineHeight: 1,
  },
}));

export const HeroButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
}));

export const StyledAuthButton = styled(GlassButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  minWidth: '160px',
}));

export const LoginButton = styled(StyledAuthButton)({
  background: 'rgba(255,255,255,0.5)',
});

export const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 2),
  maxWidth: '1200px',
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

export const GridSection = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(4),
}));

export const StepsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(4),
}));

export const FeatureCard = styled(GlassCard)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

export const StepCard = styled(GlassCard)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
}));

export const StepNumber = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginBottom: theme.spacing(2),
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
  padding: theme.spacing(6, 2),
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.3)',
  color: theme.palette.text.secondary,
  position: 'relative',
  zIndex: 1,
}));

export const FooterContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
}));

export const FooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}));

export const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.2s',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
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
