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
import CampaignIcon from '@mui/icons-material/Campaign';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

// Стили для контейнера
const PopoverContainer = styled(Paper)(({ theme }) => ({
    width: 360,
    maxHeight: 480,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Стекло
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
const getIconByType = (type) => {
    switch (type) {
        case 'Bill': return <ReceiptIcon color="primary" />;
        case 'Debt': return <ErrorIcon color="error" />;
        case 'Request': return <BuildIcon color="info" />;
        case 'Outage': return <PowerOffIcon color="warning" />;
        case 'Announcement': return <CampaignIcon color="secondary" />;
        default: return <InfoIcon color="action" />;
    }
};

const NotificationsPopover = ({ notifications, loading, onMarkAllRead, onClose }) => {
    const navigate = useNavigate();

    const handleItemClick = (notification) => {
        onClose(); // Закрываем попап
        
        // Логика перехода
        switch (notification.type) {
            case 'Bill':
            case 'Debt':
                navigate('/bills'); 
                break;
            case 'Request':
                navigate('/requests');
                break;
            case 'Outage':
            case 'Announcement':
                // Можно открыть модалку новостей или просто остаться на месте
                // navigate('/'); 
                break;
            default:
                break;
        }
    };

    return (
        <PopoverContainer elevation={3}>
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
                                        {getIconByType(n.type)}
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
                                                    {n.text}
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