import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem, IconButton, Badge, Divider } from '@mui/material';
import { Notifications, AccountBalanceWallet, Person, Logout, Login } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { GlassButton } from '../common';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import {
    StyledAppBar,
    StyledToolbar,
    LogoContainer,
    LogoText,
    NavLinks,
    StyledNavLink,
    ActionsContainer,
    UserInfo,
    UserAvatar,
    BalanceWidget,
    UserName,
    StyledMenu,
    IconWrapper
} from './Header.styles';

const Header = () => {
    const { user, isAuthenticated, logout, isLoginOpen, isRegisterOpen, openLogin, openRegister, closeModals } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate(ROUTES.HOME);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate(ROUTES.PROFILE);
    };

    const handleGuestNav = (e, path) => {
        if (path.startsWith('#')) {
            e.preventDefault();
            const targetId = path.substring(1);
            
            if (location.pathname !== ROUTES.HOME) {
                navigate(ROUTES.HOME);
                setTimeout(() => {
                    const element = document.getElementById(targetId);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const element = document.getElementById(targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const guestLinks = [
        { title: 'О сервисе', path: '#for-whom' },
        { title: 'Преимущества', path: '#advantages' },
        { title: 'Новости', path: '#news' },
        { title: 'О нас', path: '#about' },
        { title: 'Контакты', path: '#contacts' },
    ];

    const userLinks = [
        { title: 'Главная', path: ROUTES.HOME },
        { title: 'Счетчики', path: ROUTES.METERS },
        { title: 'Платежи', path: ROUTES.PAYMENTS },
        { title: 'Заявки', path: ROUTES.REQUESTS },
    ];

    return (
        <>
            <StyledAppBar position="sticky">
                <StyledToolbar>
                    <LogoContainer to={ROUTES.HOME}>
                        <LogoText>Горизонт онлайн</LogoText>
                    </LogoContainer>

                    {/* Навигационные ссылки */}
                    <NavLinks>
                        {isAuthenticated ? (
                            userLinks.map((link) => (
                                <StyledNavLink key={link.title} to={link.path}>
                                    {link.title}
                                </StyledNavLink>
                            ))
                        ) : (
                            guestLinks.map((link) => (
                                <StyledNavLink 
                                    key={link.title} 
                                    to={link.path.startsWith('#') ? ROUTES.HOME : link.path}
                                    onClick={(e) => handleGuestNav(e, link.path)}
                                >
                                    {link.title}
                                </StyledNavLink>
                            ))
                        )}
                    </NavLinks>
                    
                    {/* Действия пользователя */}
                    <ActionsContainer>
                        {isAuthenticated ? (
                            <>
                                <BalanceWidget>
                                    <AccountBalanceWallet fontSize="small" />
                                    0.00 ₽
                                </BalanceWidget>
                                
                                <IconButton color="inherit">
                                    <Badge badgeContent={0} color="error">
                                        <Notifications />
                                    </Badge>
                                </IconButton>

                                <UserInfo onClick={handleMenuOpen}>
                                    <UserName variant="body2">
                                        {user?.fullName?.split(' ')[0] || 'User'}
                                    </UserName>
                                    <UserAvatar src={user?.avatarUrl}>
                                        {user?.fullName?.[0] || 'U'}
                                    </UserAvatar>
                                </UserInfo>

                                <StyledMenu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleProfile}>
                                        <IconWrapper>
                                            <Person fontSize="small" />
                                        </IconWrapper>
                                        Профиль
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>
                                        <IconWrapper>
                                            <Logout fontSize="small" />
                                        </IconWrapper>
                                        Выйти
                                    </MenuItem>
                                </StyledMenu>
                            </>
                        ) : (
                            <GlassButton 
                                startIcon={<Login />}
                                onClick={openLogin}
                            >
                                Войти
                            </GlassButton>
                        )}
                    </ActionsContainer>
                </StyledToolbar>
            </StyledAppBar>
            
            {/* Модальные окна для входа и регистрации */}
            <LoginModal 
                open={isLoginOpen} 
                onClose={closeModals} 
                onSwitchToRegister={openRegister} 
            />
            <RegisterModal 
                open={isRegisterOpen} 
                onClose={closeModals} 
                onSwitchToLogin={openLogin} 
            />
        </>
    );
};

export default Header;
