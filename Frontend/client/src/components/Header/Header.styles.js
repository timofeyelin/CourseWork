import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Box, Avatar, Typography, Menu } from '@mui/material';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: theme.custom.glass.border,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
    color: theme.palette.text.primary,
    position: 'sticky',
    top: 0,
    zIndex: 1100,
}));

export const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    minHeight: '70px !important',
});

export const LogoContainer = styled(Link)({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    flex: 1,
    justifyContent: 'flex-start',
});

export const LogoText = styled('span')(({ theme }) => ({
    fontSize: '1.5rem',
    fontWeight: 700,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
}));

export const NavLinks = styled(Box)({
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center',
});

export const StyledNavLink = styled(RouterNavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: '0.95rem',
    padding: '8px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: 'rgba(2, 136, 209, 0.08)',
        transform: 'translateY(-1px)',
    },
    '&.active': {
        color: theme.palette.primary.main,
        backgroundColor: 'transparent',
    },
}));

export const ActionsContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    justifyContent: 'flex-end',
});

export const UserInfo = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '24px',
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
});

export const UserAvatar = styled(Avatar)(({ theme }) => ({
    width: 36,
    height: 36,
    backgroundColor: theme.palette.primary.main,
    fontSize: '0.9rem',
    fontWeight: 600,
}));

export const BalanceWidget = styled(Box)(({ theme }) => ({
    padding: '8px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: theme.palette.success.main,
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'default',
}));

export const UserName = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
        display: 'block',
    },
}));

export const StyledMenuItem = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export const IconWrapper = styled(Box)({
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
});

export const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        elevation: 0,
        overflow: 'visible',
        filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
        marginTop: theme.spacing(1.5),
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '16px',
        padding: '8px',
        minWidth: '200px',
        '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            marginLeft: -4,
            marginRight: 8,
        },
        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
        },
        '& .MuiMenuItem-root': {
            borderRadius: '12px',
            margin: '4px 0',
            padding: '10px 16px',
            transition: 'all 0.2s ease',
            '&:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.08)',
                color: theme.palette.primary.main,
                transform: 'translateX(4px)',
            },
        },
        '& .MuiDivider-root': {
            margin: '8px 0',
            borderColor: 'rgba(0, 0, 0, 0.06)',
        }
    },
}));