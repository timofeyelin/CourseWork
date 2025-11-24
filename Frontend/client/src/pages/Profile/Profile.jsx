import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Paper, 
    Typography, 
    Button, 
    Avatar, 
    CircularProgress,
    Box
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Home as HomeIcon,
    AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { userService } from '../../api';
import { ROUTES } from '../../utils/constants';
import styles from './Profile.module.css';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // MOCK DATA: Имитация данных для разработки интерфейса
            setTimeout(() => {
                setProfile({
                    fullName: 'Иванов Иван Иванович',
                    email: 'ivanov@example.com',
                    createdAt: '2024-01-15T10:00:00.000Z'
                });

                setAccounts([
                    {
                        id: 1,
                        accountNumber: '1234567890',
                        area: 54.5,
                        address: 'г. Москва, ул. Строителей, д. 10, кв. 5'
                    },
                    {
                        id: 2,
                        accountNumber: '0987654321',
                        area: 32.0,
                        address: 'г. Москва, ул. Ленина, д. 5, кв. 12'
                    },
                    {
                        id: 3,
                        accountNumber: '1122334455',
                        area: 78.2,
                        address: 'г. Санкт-Петербург, Невский пр., д. 1, кв. 1'
                    }
                ]);
                setLoading(false);
            }, 800);

            /* Временно скрываем реальные запросы к API
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    navigate(ROUTES.LOGIN);
                    return;
                }

                const [profileRes, accountsRes] = await Promise.all([
                    userService.getProfile(),
                    userService.getAccounts()
                ]);

                setProfile(profileRes.data);
                setAccounts(accountsRes.data);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate(ROUTES.LOGIN);
                } else {
                    setError('Не удалось загрузить данные профиля');
                }
            } finally {
                setLoading(false);
            }
            */
        };

        fetchData();
    }, [navigate]);

    const handleEditProfile = () => {
        // TODO: Implement modal for editing profile
        alert('Функционал редактирования профиля будет доступен позже');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress sx={{ color: 'white' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorCard}>
                    <Typography color="error" variant="h6" gutterBottom>
                        Ошибка
                    </Typography>
                    <Typography variant="body1">
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Повторить
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Paper className={styles.profileCard} elevation={0}>
                {/* Header Section */}
                <div className={styles.headerSection}>
                    <div className={styles.headerContent}>
                        <div className={styles.userInfo}>
                            <Avatar className={styles.avatar}>
                                {profile ? getInitials(profile.fullName) : 'U'}
                            </Avatar>
                            <div className={styles.userDetails}>
                                <h1>{profile?.fullName || 'Пользователь'}</h1>
                                <p className={styles.email}>{profile?.email}</p>
                                <p className={styles.registrationDate}>
                                    На сайте с {new Date(profile?.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="contained" 
                            startIcon={<EditIcon />}
                            className={styles.editButton}
                            onClick={handleEditProfile}
                        >
                            Редактировать
                        </Button>
                    </div>
                </div>

                {/* Content Section */}
                <div className={styles.contentSection}>
                    <Typography variant="h5" className={styles.sectionTitle}>
                        <WalletIcon sx={{ color: '#667eea' }} />
                        Мои лицевые счета
                    </Typography>

                    {accounts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                            <Typography>У вас пока нет привязанных лицевых счетов.</Typography>
                        </Box>
                    ) : (
                        <div className={styles.accountsGrid}>
                            {accounts.map((account) => (
                                <div key={account.id} className={styles.accountCard}>
                                    <div className={styles.accountHeader}>
                                        <div>
                                            <div className={styles.accountNumberLabel}>Лицевой счет</div>
                                            <div className={styles.accountNumber}>{account.accountNumber}</div>
                                        </div>
                                        <div className={styles.accountArea}>
                                            {account.area} м²
                                        </div>
                                    </div>
                                    <div className={styles.accountAddress}>
                                        <HomeIcon className={styles.addressIcon} fontSize="small" />
                                        {account.address}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Paper>
        </div>
    );
};

export default Profile;
