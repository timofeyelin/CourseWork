import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem, IconButton, Badge, Divider, Popover, Box } from '@mui/material';
import { Notifications, AccountBalanceWallet, Person, Logout, Login, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationsPopover from './NotificationsPopover';
import { GlassButton } from '../common';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import PaymentModal from '../Modals/PaymentModal';
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
    const { user, isAuthenticated, isAdminOrOperator, isAdmin, isOperator, logout, isLoginOpen, isRegisterOpen, openLogin, openRegister, closeModals } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { balance, debt, refreshBalance } = useAuth();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const handlePaymentSuccess = () => {
        refreshBalance();
    };

    const { 
        items: notifications, 
        unreadCount, 
        loading: notificationsLoading, 
        markAllAsRead,
        markAsRead,
        reload: reloadNotifications
    } = useNotifications(isAuthenticated);

    const urgentNotifications = useMemo(
        () => (notifications || []).filter((n) => n?.isUrgent === true),
        [notifications]
    );
    
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);

     const handleNotifClick = (event) => {
        setNotifAnchorEl(event.currentTarget);
        reloadNotifications();
    };

    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    const isNotifOpen = Boolean(notifAnchorEl);
    const notifId = isNotifOpen ? 'notifications-popover' : undefined;

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
    ];

    if (!isAdminOrOperator) {
        userLinks.push(
            { title: 'Счетчики', path: ROUTES.METERS },
            { title: 'Платежи', path: ROUTES.PAYMENTS },
            { title: 'Заявки', path: ROUTES.REQUESTS },
            { title: 'Документы', path: ROUTES.DOCUMENTS },
        );
    }

    if (isAdmin) {
        userLinks.push({ title: 'Жители', path: ROUTES.ADMIN_RESIDENTS });
        userLinks.push({ title: 'Аналитика', path: ROUTES.ADMIN_DASHBOARD });
        userLinks.push({ title: 'Категории заявок', path: ROUTES.ADMIN_CATEGORIES });
    }

    if (isOperator) {
        userLinks.push({ title: 'Объявления', path: ROUTES.OPERATOR_ANNOUNCEMENTS });
        userLinks.push({ title: 'Диспетчерская', path: ROUTES.OPERATOR_REQUESTS });
    }

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
                                {!isAdminOrOperator && (
                                    <BalanceWidget sx={{ 
                                        color: debt > 0 ? '#ff4d4d' : '#4caf50',
                                        backgroundColor: debt > 0 ? 'rgba(255, 77, 77, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                                        marginRight: '15px',
                                        paddingRight: '8px'
                                    }}>
                                        <AccountBalanceWallet fontSize="small" />
                                        {balance > 0 ? balance.toFixed(2) : '0.00'} ₽
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => {
                                                e.currentTarget.blur();
                                                setIsPaymentOpen(true);
                                            }}
                                            sx={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                color: 'inherit',
                                                width: 24,
                                                height: 24,
                                                ml: 0.5,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                }
                                            }}
                                        >
                                            <AddIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </BalanceWidget>
                                )}
                                
                                <IconButton 
                                    color="inherit" 
                                    onClick={handleNotifClick}
                                    aria-describedby={notifId}
                                >
                                    <Badge badgeContent={unreadCount} color="error" max={99} invisible={unreadCount === 0}>
                                        <Notifications />
                                    </Badge>
                                </IconButton>

                                <Popover
                                    id={notifId}
                                    open={isNotifOpen}
                                    anchorEl={notifAnchorEl}
                                    onClose={handleNotifClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    PaperProps={{
                                        sx: { 
                                            p: 0,
                                            backgroundColor: 'transparent',
                                            backgroundImage: 'none', 
                                            boxShadow: 'none',
                                            borderRadius: 20,        
                                            overflow: 'visible',
                                            mt: 1.5
                                        }
                                    }}
                                >
                                    <NotificationsPopover 
                                        notifications={notifications}
                                        loading={notificationsLoading}
                                        onMarkAllRead={markAllAsRead}
                                        onMarkRead={markAsRead}
                                        onClose={handleNotifClose}
                                    />
                                </Popover>

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
            <PaymentModal 
                open={isPaymentOpen} 
                onClose={() => setIsPaymentOpen(false)} 
                onSuccess={handlePaymentSuccess} 
            />
        </>
    );
};

export default Header;
