import { styled } from '@mui/material/styles';
import { Box, Typography, CardActionArea, Alert, DialogContentText } from '@mui/material';
import { GlassCard, GlassButton } from '../../components/common';

export const HomeContainer = styled('div')(({ theme }) => ({
    minHeight: '100%',
    background: theme.custom.gradients.mainBg,
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '1rem',
    },
}));

export const HomeContent = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1000px',
}));

export const DashboardContainer = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(4),
}));

export const WelcomeSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
}));

export const WelcomeTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    marginBottom: theme.spacing(1),
}));

export const WidgetsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(4),
}));

export const WidgetCard = styled(GlassCard)(({ theme, color }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: '160px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.custom.glass.shadow,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: color || theme.palette.primary.main,
        opacity: 0.1,
        borderRadius: '0 0 0 100%',
        zIndex: 0,
    },
}));

export const WidgetHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    zIndex: 1,
}));

export const WidgetTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
}));

export const WidgetValue = styled(Typography)(({ theme, color }) => ({
    color: color || theme.palette.text.primary,
    fontWeight: 700,
    fontSize: '2rem',
    zIndex: 1,
}));

export const WidgetIcon = styled(Box)(({ theme, color }) => ({
    color: color || theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    borderRadius: '12px',
    backgroundColor: `${color}15` || `${theme.palette.primary.main}15`,
}));

export const OutageBanner = styled(GlassCard)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    backgroundColor: '#ffebee', // Light red
    border: '1px solid #ef9a9a',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: '#c62828',
}));

export const NewsSectionHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

export const NewsSectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    border: 'none',
    color: theme.palette.text.primary,
    alignItems: 'center',
    '& .MuiAlert-icon': {
        color: theme.palette.primary.main,
        fontSize: '24px',
    },
    '& .MuiAlert-message': {
        fontWeight: 500,
    }
}));

export const NewsSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const NewsCard = styled(GlassCard)(({ theme }) => ({
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'scale(1.01)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
}));

export const NewsActionArea = styled(CardActionArea)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
}));

export const NewsHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

export const NewsTitleWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

export const NewsTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
}));

export const NewsDate = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
}));

export const NewsContent = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}));

export const ReadMoreLink = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontSize: '0.85rem',
    fontWeight: 600,
    marginTop: theme.spacing(1),
}));

export const NewBadge = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginLeft: theme.spacing(1),
}));

export const CloseButtonWrapper = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: 16,
    top: 16,
}));

export const NewsMetaInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
    flexWrap: 'wrap',
}));

export const NewsFullContent = styled(DialogContentText)(({ theme }) => ({
    color: theme.palette.text.primary,
    whiteSpace: 'pre-wrap',
    fontSize: '1.05rem',
    lineHeight: 1.6,
    padding: theme.spacing(0, 1),
}));

export const ModalHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
}));

export const ModalIconWrapper = styled(Box)(({ theme, isEmergency }) => ({
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: isEmergency ? 'rgba(211, 47, 47, 0.1)' : 'rgba(2, 136, 209, 0.1)',
    color: isEmergency ? theme.palette.error.main : theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    '& svg': {
        fontSize: '32px',
    }
}));

export const ModalDateWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 500,
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
}));



export const OutageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
}));

export const ReadMoreIcon = styled(Box)(({ theme }) => ({
    fontSize: 16,
    marginLeft: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
}));

export const CloseButton = styled(GlassButton)(({ theme }) => ({
    minWidth: 'auto',
    padding: theme.spacing(1),
}));
