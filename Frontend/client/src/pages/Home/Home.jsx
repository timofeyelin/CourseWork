import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    CircularProgress, 
    DialogContent, 
    Chip,
    Snackbar,
    Alert
} from '@mui/material';
import { 
    AccountBalanceWallet, 
    Assignment, 
    Warning, 
    Notifications,
    ArrowForward,
    Close,
    CalendarMonth
} from '@mui/icons-material';
import { billsService, requestsService, announcementsService } from '../../api';
import { ERROR_MESSAGES } from '../../utils/constants';
import { 
    DashboardContainer, 
    WidgetsGrid, 
    WidgetCard, 
    WidgetHeader, 
    WidgetTitle, 
    WidgetValue, 
    WidgetIcon,
    OutageBanner,
    NewsSection,
    NewsCard,
    NewsActionArea,
    NewsHeader,
    NewsTitle,
    NewsDate,
    NewsContent,
    NewBadge,
    WelcomeSection,
    WelcomeTitle,
    NewsSectionHeader,
    NewsSectionTitle,
    StyledAlert,
    NewsTitleWrapper,
    ReadMoreLink,
    CloseButtonWrapper,
    NewsMetaInfo,
    NewsFullContent,
    LoadingContainer,
    OutageTitle,
    ReadMoreIcon,
    CloseButton,
    HomeContainer,
    HomeContent,
    ModalHeader,
    ModalIconWrapper,
    ModalDateWrapper
} from './Home.styles';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../components/common';

const Home = () => {
    const [balance, setBalance] = useState(0);
    const [openRequestsCount, setOpenRequestsCount] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newsError, setNewsError] = useState(false);
    
    const [selectedNews, setSelectedNews] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        
        try {
            const billsRes = await billsService.getBills();
            const unpaid = billsRes.data
                .filter(b => b.status === 0 || b.status === 'Pending')
                .reduce((sum, b) => sum + b.totalAmount, 0);
            setBalance(unpaid);
        } catch (e) {
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.BALANCE_LOAD_FAILED,
                severity: 'error'
            });
        }

        try {
            const requestsRes = await requestsService.getUserRequests();
            const open = requestsRes.data.filter(r => r.status === 1 || r.status === 2 || r.status === 'New' || r.status === 'InProgress').length;
            setOpenRequestsCount(open);
        } catch (e) {
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.REQUESTS_LOAD_FAILED,
                severity: 'error'
            });
        }

        try {
            const newsRes = await announcementsService.getAll();
            const sortedNews = newsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAnnouncements(sortedNews);
            setNewsError(false);
        } catch (e) {
            setNewsError(true);
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.NEWS_LOAD_FAILED,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenNews = async (news) => {
        setSelectedNews(news);
        setIsModalOpen(true);

        if (!news.isRead) {
            try {
                await announcementsService.markAsRead(news.announcementId);
                setAnnouncements(prev => prev.map(item => 
                    item.announcementId === news.announcementId 
                        ? { ...item, isRead: true } 
                        : item
                ));
            } catch (e) {
                setSnackbar({
                    open: true,
                    message: ERROR_MESSAGES.MARK_READ_FAILED,
                    severity: 'error'
                });
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedNews(null), 300); 
    };

    const outages = announcements.filter(a => a.isEmergency);

    if (loading && announcements.length === 0 && balance === 0 && openRequestsCount === 0) {
        return (
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    return (
        <HomeContainer>
            <HomeContent>
                <DashboardContainer>
                    {/* Секция приветствия */}
                    <WelcomeSection>
                        <WelcomeTitle variant='h4' component='h1'>
                            Добро пожаловать!
                        </WelcomeTitle>
                        <Typography variant='body1' color="text.secondary">
                            Обзор вашего лицевого счета и новости УК
                        </Typography>
                    </WelcomeSection>

                    {/* Виджеты баланса и заявок */}
                    <WidgetsGrid>
                        <WidgetCard color="#0288D1">
                            <WidgetHeader>
                                <WidgetTitle>Баланс</WidgetTitle>
                                <WidgetIcon color="#0288D1">
                                    <AccountBalanceWallet />
                                </WidgetIcon>
                            </WidgetHeader>
                            <Box>
                                <WidgetValue color={balance > 0 ? "#d32f2f" : "#2e7d32"}>
                                    {balance.toLocaleString('ru-RU')} ₽
                                </WidgetValue>
                                <Typography variant="caption" color="text.secondary">
                                    {balance > 0 ? 'Задолженность' : 'Все оплачено'}
                                </Typography>
                            </Box>
                        </WidgetCard>

                        <WidgetCard color="#FF9800">
                            <WidgetHeader>
                                <WidgetTitle>Заявки</WidgetTitle>
                                <WidgetIcon color="#FF9800">
                                    <Assignment />
                                </WidgetIcon>
                            </WidgetHeader>
                            <Box>
                                <WidgetValue>
                                    {openRequestsCount}
                                </WidgetValue>
                                <Typography variant="caption" color="text.secondary">
                                    Открытых заявок
                                </Typography>
                            </Box>
                        </WidgetCard>
                    </WidgetsGrid>

                    {/* Баннеры отключений */}
                    {outages.map(outage => (
                        <OutageBanner key={outage.announcementId}>
                            <Warning color="error" />
                            <Box>
                                <OutageTitle variant="subtitle1">
                                    {outage.title}
                                </OutageTitle>
                                <Typography variant="body2">
                                    {outage.content}
                                </Typography>
                            </Box>
                        </OutageBanner>
                    ))}

                    {/* Секция новостей */}
                    <NewsSectionHeader>
                        <Notifications color="primary" />
                        <NewsSectionTitle variant="h5">
                            Новости и объявления
                        </NewsSectionTitle>
                    </NewsSectionHeader>

                    {newsError && (
                        <StyledAlert severity="error">
                            {ERROR_MESSAGES.NEWS_LOAD_FAILED}
                        </StyledAlert>
                    )}

                    {!newsError && announcements.length === 0 && (
                        <StyledAlert severity="info">
                            Новостей пока нет.
                        </StyledAlert>
                    )}

                    <NewsSection>
                        {announcements.map(news => (
                            <NewsCard key={news.announcementId}>
                                <NewsActionArea onClick={() => handleOpenNews(news)}>
                                    <NewsHeader>
                                        <NewsTitleWrapper>
                                            <NewsTitle>{news.title}</NewsTitle>
                                            {!news.isRead && <NewBadge>Новое</NewBadge>}
                                        </NewsTitleWrapper>
                                        <NewsDate>
                                            {new Date(news.createdAt).toLocaleDateString('ru-RU')}
                                        </NewsDate>
                                    </NewsHeader>
                                    <NewsContent>
                                        {news.content}
                                    </NewsContent>
                                    <ReadMoreLink>
                                        Читать полностью 
                                        <ReadMoreIcon>
                                            <ArrowForward fontSize="inherit" />
                                        </ReadMoreIcon>
                                    </ReadMoreLink>
                                </NewsActionArea>
                            </NewsCard>
                        ))}
                    </NewsSection>

                    {/* Модальное окно новости */}
                    <GlassDialog 
                        open={isModalOpen} 
                        onClose={handleCloseModal}
                        maxWidth="md"
                        fullWidth
                    >
                        {selectedNews && (
                            <>
                                <GlassDialogTitle>
                                    <ModalHeader>
                                        <ModalIconWrapper isEmergency={selectedNews.isEmergency}>
                                            {selectedNews.isEmergency ? <Warning /> : <Notifications />}
                                        </ModalIconWrapper>
                                        {selectedNews.title}
                                    </ModalHeader>
                                    <CloseButtonWrapper>
                                        <CloseButton onClick={handleCloseModal}>
                                            <Close />
                                        </CloseButton>
                                    </CloseButtonWrapper>
                                </GlassDialogTitle>
                                <DialogContent>
                                    <NewsMetaInfo>
                                        <ModalDateWrapper>
                                            <CalendarMonth fontSize="small" />
                                            {new Date(selectedNews.createdAt).toLocaleDateString('ru-RU', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </ModalDateWrapper>
                                        {selectedNews.isEmergency && (
                                            <Chip label="Важно" color="error" size="small" />
                                        )}
                                    </NewsMetaInfo>
                                    <NewsFullContent>
                                        {selectedNews.content}
                                    </NewsFullContent>
                                </DialogContent>
                                <GlassDialogActions>
                                    <GlassButton onClick={handleCloseModal}>
                                        Закрыть
                                    </GlassButton>
                                </GlassDialogActions>
                            </>
                        )}
                    </GlassDialog>

                </DashboardContainer>
            </HomeContent>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </HomeContainer>
    );
}

export default Home;