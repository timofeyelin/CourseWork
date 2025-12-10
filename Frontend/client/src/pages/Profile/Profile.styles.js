import { styled, alpha } from '@mui/material/styles';
import { 
    Paper, 
    Avatar, 
    Typography, 
    Box, 
    IconButton,
    Alert
} from '@mui/material';
import { GlassCard } from '../../components/common';

export const ProfileContainer = styled('div')(({ theme }) => ({
    minHeight: '100%',
    background: theme.custom.gradients.mainBg,
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '1rem',
    },
}));

export const ProfileCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '1000px',
    overflow: 'hidden',
    animation: 'fadeIn 0.5s ease-out',
    '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    [theme.breakpoints.down('lg')]: {
        maxWidth: '95%',
    },
}));

export const HeaderSection = styled('div')(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.4)',
    padding: '3rem 3rem 2rem',
    borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
    [theme.breakpoints.down('md')]: {
        padding: '1.5rem',
    },
}));

export const HeaderContent = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        textAlign: 'center',
    },
}));

export const UserInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: '1rem',
    },
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: '80px',
    height: '80px',
    background: theme.palette.primary.main,
    fontSize: '2rem',
    boxShadow: '0 4px 10px rgba(2, 136, 209, 0.3)',
}));

export const UserDetails = styled('div')(({ theme }) => ({
    '& h1': {
        margin: 0,
        color: theme.palette.text.primary,
        fontSize: '1.75rem',
        fontWeight: 700,
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.5rem',
        },
    },
}));

export const UserEmail = styled('p')(({ theme }) => ({
    color: theme.palette.text.secondary,
    margin: '0.25rem 0 0 0',
    fontSize: '0.95rem',
}));

export const RegistrationDate = styled('p')(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    marginTop: '0.25rem',
}));

export const ContentSection = styled('div')(({ theme }) => ({
    padding: '3rem',
    background: 'transparent',
    [theme.breakpoints.down('md')]: {
        padding: '1.5rem',
    },
}));

export const SectionHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: '700',
    marginBottom: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.5rem',
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
    },
}));

export const EmptyAccounts = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: '2rem 0',
    color: theme.palette.text.secondary,
}));

export const AccountsGrid = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
    },
}));

export const AccountCard = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: '12px',
    padding: '1.5rem',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        borderColor: theme.palette.primary.main,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: theme.palette.primary.main,
    },
    [theme.breakpoints.down('sm')]: {
        padding: '1rem',
    },
}));

export const AccountHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flexStart',
    marginBottom: '1rem',
}));

export const AccountNumberLabel = styled('div')(({ theme }) => ({
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: theme.palette.text.secondary,
    marginBottom: '0.25rem',
}));

export const AccountNumber = styled('div')(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.error.main,
    transition: 'all 0.2s',
    width: '32px',
    height: '32px',
    '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.1),
    },
    '&:focus, &:focus-visible': {
        outline: 'none',
    },
}));

export const AccountDetails = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
}));

export const AccountAddress = styled('div')(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'flexStart',
    flex: 1,
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
        marginRight: '0.5rem',
        verticalAlign: 'middle',
    },
}));

export const AccountArea = styled('div')(({ theme }) => ({
    background: alpha(theme.palette.primary.main, 0.08),
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    '& .MuiSvgIcon-root': {
        marginRight: '0.25rem',
        fontSize: '1rem',
    },
}));

export const AccountActions = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: `1px solid ${theme.palette.divider}`,
}));

export const LoadingContainer = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    '& .MuiCircularProgress-root': {
        color: theme.palette.primary.main,
    },
}));

export const ErrorContainer = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    padding: '2rem',
}));

export const ErrorCard = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    '& .MuiButton-root': {
        marginTop: '1rem',
    },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
    width: '100%',
}));

export const AddAccountDescription = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));
