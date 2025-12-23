import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { billsService, requestsService, announcementsService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { ERROR_MESSAGES, ANNOUNCEMENT_TYPES } from '../../utils/constants'; 
import { 
    HomeContainer, 
    HomeContent, 
    DashboardContainer, 
    LoadingContainer 
} from './Home.styles';
import WelcomeBlock from './components/WelcomeBlock';
import StatsWidgets from './components/StatsWidgets';
import OutageBanners from './components/OutageBanners';
import NewsFeed from './components/NewsFeed';
import NewsModal from './components/NewsModal';
import PaymentModal from '../../components/Modals/PaymentModal';
import { AppSnackbar } from '../../components/common';

const Home = () => {
    const { balance, debt, refreshBalance } = useAuth();
    const [openRequestsCount, setOpenRequestsCount] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newsError, setNewsError] = useState(false);
    
    const [selectedNews, setSelectedNews] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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
            await refreshBalance();
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
            // Сортировка: сначала тип (Аварии=2, Отключения=1, Инфо=0), потом дата
            const sortedNews = newsRes.data.sort((a, b) => {
                if (b.type !== a.type) return b.type - a.type;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
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

    const outages = announcements.filter(a => 
        a.type === ANNOUNCEMENT_TYPES.EMERGENCY || 
        a.type === ANNOUNCEMENT_TYPES.OUTAGE
    );

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
                    <WelcomeBlock />

                    <StatsWidgets 
                        balanceData={{ balance, debt }} 
                        openRequestsCount={openRequestsCount} 
                        onPaymentClick={() => {
                            setIsPaymentOpen(true);
                        }}
                    />

                    {/* Баннеры теперь получают отфильтрованные по типу новости */}
                    <OutageBanners outages={outages} />

                    <NewsFeed 
                        announcements={announcements} 
                        newsError={newsError} 
                        onOpenNews={handleOpenNews} 
                    />

                    <NewsModal 
                        open={isModalOpen} 
                        news={selectedNews} 
                        onClose={handleCloseModal} 
                    />

                    <PaymentModal 
                        open={isPaymentOpen} 
                        onClose={() => {
                            setIsPaymentOpen(false);
                        }} 
                        onSuccess={() => refreshBalance()} 
                    />

                </DashboardContainer>
            </HomeContent>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </HomeContainer>
    );
}

export default Home;