import { styled } from '@mui/material/styles';
import { Paper, Typography, Box, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { GlassCard, GlassButton } from '../../components/StyledComponents';

export const RegisterContainer = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    background: theme.custom.gradients.mainBg,
    padding: '20px',
    boxSizing: 'border-box',
}));

export const RegisterCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '480px',
    padding: '20px 32px',
    boxSizing: 'border-box',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
        padding: '24px 20px',
    },
    '@media (max-height: 800px)': {
        padding: '16px 24px',
    },
}));

export const Header = styled('div')(({ theme }) => ({
    textAlign: 'center',
    marginBottom: '10px',
    '@media (max-height: 800px)': {
        marginBottom: '8px',
    },
}));

export const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: '4px',
    fontSize: '1.75rem',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
    },
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: 0,
    fontSize: '0.9rem',
    fontWeight: '500',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
    },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
    marginBottom: '12px',
    fontSize: '0.813rem',
}));

export const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.text.primary,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: 'inset 0 0 20px 20px transparent',
    },
    '@media (max-height: 800px)': {
        gap: '10px',
    },
}));

export const FormField = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    '& .MuiOutlinedInput-root:focus-within': {
        outline: 'none',
    },
    '& .MuiIconButton-root:focus': {
        outline: 'none',
    },
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: '13px',
}));

export const RequiredStar = styled('span')(({ theme }) => ({
    color: theme.palette.error.main,
}));

export const PasswordStrength = styled(Box)(({ theme }) => ({
    marginTop: '8px',
    position: 'relative',
}));

export const StrengthBarContainer = styled(Box)(({ theme }) => ({
    height: '4px',
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
}));

export const StrengthBar = styled(Box)(({ theme }) => ({
    height: '100%',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    position: 'absolute',
    top: 0,
    left: 0,
}));

export const StrengthText = styled(Typography)(({ theme }) => ({
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    fontWeight: '500',
}));

export const FormOptions = styled(Box)(({ theme }) => ({
    marginTop: '4px',
    '& .MuiFormControlLabel-root': {
        alignItems: 'flex-start',
        marginLeft: '-8px',
    },
    '& .MuiCheckbox-root': {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: '2px',
    },
    '& .MuiTypography-root': {
        fontSize: '0.813rem',
        color: theme.palette.text.secondary,
        lineHeight: 1.5,
    },
}));

export const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
        color: theme.palette.primary.dark,
    },
}));

export const SubmitButton = styled(GlassButton)(({ theme }) => ({
    marginTop: '8px',
    width: '100%',
    '&:hover': {
        background: theme.palette.primary.dark,
        boxShadow: '0 6px 20px rgba(2, 119, 189, 0.4)',
    },
    '&:focus, &:focus-visible': {
        outline: 'none',
    },
    '&:disabled': {
        background: '#ccc',
        boxShadow: 'none',
    },
}));

export const LoginText = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginTop: '8px',
    color: theme.palette.text.secondary,
    fontSize: '0.813rem',
}));

export const LoginLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
        textDecoration: 'underline',
        color: theme.palette.primary.dark,
    },
}));
