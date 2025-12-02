import { styled } from '@mui/material/styles';
import { Paper, Typography, Box, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { GlassCard, GlassButton } from '../../components/StyledComponents';

export const LoginContainer = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    background: theme.custom.gradients.mainBg,
    padding: '20px',
    boxSizing: 'border-box',
}));

export const LoginCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '480px',
    padding: '32px 40px',
    boxSizing: 'border-box',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
        padding: '24px 20px',
    },
    '@media (max-height: 700px)': {
        padding: '20px 24px',
    },
}));

export const Header = styled('div')(({ theme }) => ({
    textAlign: 'center',
    marginBottom: '20px',
}));

export const LogoIconWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
    '@media (max-height: 700px)': {
        marginBottom: '8px',
    },
}));

export const StyledIcon = styled(Icon)(({ theme }) => ({
    width: '52px',
    height: '52px',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
        width: '48px',
        height: '48px',
    },
    '@media (max-height: 700px)': {
        width: '40px',
        height: '40px',
    },
}));

export const Title = styled(Typography)(({ theme }) => ({
    fontWeight: '700',
    color: theme.palette.text.primary,
    marginBottom: '6px',
    fontSize: '1.75rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
    },
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
    fontWeight: '500',
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
    },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
    marginBottom: '12px',
    borderRadius: '8px',
    fontSize: '0.813rem',
}));

export const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.text.primary,
        transition: 'background-color 5000s ease-in-out 0s',
        boxShadow: 'inset 0 0 20px 20px transparent',
    },
}));

export const FormField = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    '& .MuiIconButton-root:focus': {
        outline: 'none',
    },
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
    display: 'block',
    color: theme.palette.text.primary,
    fontWeight: '500',
    fontSize: '13px',
}));

export const FormOptions = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '-4px',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '8px',
    '& .MuiCheckbox-root': {
        color: theme.palette.text.secondary,
    },
    '& .MuiCheckbox-root.Mui-checked': {
        color: theme.palette.primary.main,
    },
    '& .MuiCheckbox-root:focus': {
        outline: 'none',
    },
    '& .MuiTypography-root': {
        fontSize: '0.813rem',
        color: theme.palette.text.secondary,
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
    },
}));

export const ForgotLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'color 0.2s',
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
        boxShadow: '0 4px 12px rgba(2, 119, 189, 0.4)',
    },
    '&:focus, &:focus-visible': {
        outline: 'none',
    },
    '&:disabled': {
        background: '#BDBDBD',
        boxShadow: 'none',
    },
}));

export const Divider = styled('div')(({ theme }) => ({
    position: 'relative',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '14px',
    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        width: '45%',
        height: '1px',
        backgroundColor: theme.palette.divider,
    },
    '&::before': {
        left: 0,
    },
    '&::after': {
        right: 0,
    },
}));

export const RegisterText = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '0.813rem',
}));

export const RegisterLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.2s',
    '&:hover': {
        textDecoration: 'underline',
        color: theme.palette.primary.dark,
    },
}));
