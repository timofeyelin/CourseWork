import React from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Divider, 
    Button,
    CircularProgress,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BuildIcon from '@mui/icons-material/Build';
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

// Стили для контейнера
const PopoverContainer = styled(Paper)(({ theme }) => ({
    width: 360,
    maxHeight: 480,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',

    borderRadius: 16,

    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    backdropFilter: 'blur(12px)',

    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 14px 40px rgba(0, 0, 0, 0.22)',
}));

const NotificationItem = styled(ListItem)(({ theme, isread }) => ({
    cursor: 'pointer',
    backgroundColor: isread === 'true' ? 'transparent' : 'rgba(25, 118, 210, 0.08)', // Подсветка непрочитанных
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    transition: 'background-color 0.2s',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
}));

// Иконка в зависимости от типа
const getNotificationIcon = (notification) => {
    const { type, title } = notification;

    switch (type) {
        case 'Bill': 
            return <ReceiptIcon color="primary" />;
        case 'Debt': 
            return <ErrorIcon color="error" />;
        case 'Request': 
            return <BuildIcon color="info" />;
        
        case 'Outage':
            if (title && title.toUpperCase().includes('АВАРИЯ')) {
                return <WarningIcon color="error" />;
            }
            return <InfoIcon sx={{ color: '#ed6c02' }} />; 
            
        case 'Announcement': 
            return <NotificationsIcon color="primary" />;
            
        default: 
            return <InfoIcon color="action" />;
    }
};

const REQUEST_STATUS_RU = {
    New: 'Новая',
    InProgress: 'В работе',
    Closed: 'Выполнена',
    Rejected: 'Отклонена',
};

const localizeRequestStatusInText = (text) => {
    if (!text) return text;

    return text.replace(/\b(New|InProgress|Closed|Rejected)\b/g, (m) => REQUEST_STATUS_RU[m] ?? m);
};

const NotificationsPopover = ({ notifications, loading, onMarkAllRead, onMarkRead, onClose }) => {
    const navigate = useNavigate();

    const handleItemClick = async (notification) => {
        onClose();

        switch (notification.type) {
            case 'Bill':
            case 'Debt':
                navigate('/bills'); 
                break;
            case 'Request':
                navigate('/requests');
                break;
            case 'Outage':
                navigate(ROUTES.HOME, { state: { scrollTo: 'news' } });
                break;
            case 'Announcement':
                navigate(ROUTES.HOME, { state: { scrollTo: 'news' } });
                break;
            default:
                break;
        }

        if (!notification.isRead && typeof onMarkRead === 'function') {
            onMarkRead(notification.notificationId).catch((e) => {
                console.error('Failed to mark notification as read', e);
            });
        }
    };

    return (
        <PopoverContainer elevation={0}>
            {/* Шапка */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    Уведомления
                </Typography>
                {notifications.length > 0 && (
                    <Button size="small" onClick={onMarkAllRead} startIcon={<CheckCircleIcon />}>
                        Прочитать все
                    </Button>
                )}
            </Box>

            {/* Список */}
            <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, color: 'text.secondary' }}>
                        <NotificationsOffIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                        <Typography variant="body2">Нет новых уведомлений</Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {notifications.map((n) => (
                            <React.Fragment key={n.notificationId}>
                                <NotificationItem 
                                    isread={n.isRead.toString()}
                                    onClick={() => handleItemClick(n)}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                                        {getNotificationIcon(n)}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={
                                            <Typography variant="subtitle2" component="span" fontWeight={!n.isRead ? 'bold' : 'normal'}>
                                                {n.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" component="span" color="text.primary" display="block" sx={{ my: 0.5 }}>
                                                    {localizeRequestStatusInText(n.text)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(n.createdAt).toLocaleString('ru-RU', { 
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                                                    })}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </NotificationItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Box>
        </PopoverContainer>
    );
};

export default NotificationsPopover;