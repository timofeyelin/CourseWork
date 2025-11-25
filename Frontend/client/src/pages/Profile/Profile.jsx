import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Paper, 
    Typography, 
    Button, 
    Avatar, 
    CircularProgress,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Home as HomeIcon,
    AccountBalanceWallet as WalletIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    SquareFoot as AreaIcon
} from '@mui/icons-material';
import { userService } from '../../api';
import { ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES, INFO_MESSAGES } from '../../utils/constants';
import { accountValidationSchema } from '../../utils/validationSchemas';
import styles from './Profile.module.css';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openAddAccount, setOpenAddAccount] = useState(false);
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [addAccountError, setAddAccountError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        accountId: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchProfileData = async () => {
        // Начало MOCK данных
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
        // Конец MOCK данных

        /* Настоящий вызов API
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
                setError(ERROR_MESSAGES.PROFILE_LOAD_FAILED);
            }
        } finally {
            setLoading(false);
        }
        */
    };

    useEffect(() => {
        fetchProfileData();
    }, [navigate]);

    const handleEditProfile = () => {
        // TODO: Сделать функционал редактирования профиля
        alert(INFO_MESSAGES.EDIT_PROFILE_UNAVAILABLE);
    };

    const handleOpenAddAccount = () => {
        setOpenAddAccount(true);
        setNewAccountNumber('');
        setAddAccountError('');
    };

    const handleCloseAddAccount = () => {
        setOpenAddAccount(false);
    };

    const handleAddAccount = async () => {
        setAddAccountError('');
        
        try {
            try {
                accountValidationSchema(newAccountNumber);
            } catch (validationErrors) {
                setAddAccountError(validationErrors.accountNumber);
                return;
            }

            setIsSubmitting(true);

            // MOCK добавления счета
            setTimeout(() => {
                const newAccount = {
                    id: Date.now(),
                    accountNumber: newAccountNumber,
                    area: 0,
                    address: `${INFO_MESSAGES.ADDRESS_NOT_FOUND} (Mock)`
                };
                setAccounts([...accounts, newAccount]);
                
                setSnackbar({
                    open: true,
                    message: SUCCESS_MESSAGES.ACCOUNT_ADDED,
                    severity: 'success'
                });
                
                handleCloseAddAccount();
                setIsSubmitting(false);
            }, 500);

            /* Настоящий вызов API
            await userService.addAccount(newAccountNumber);
            
            setSnackbar({
                open: true,
                message: SUCCESS_MESSAGES.ACCOUNT_ADDED,
                severity: 'success'
            });
            
            handleCloseAddAccount();
            // Refresh accounts list
            const accountsRes = await userService.getAccounts();
            setAccounts(accountsRes.data);
            */
        } catch (err) {
            console.error('Ошибка при добавлении счета:', err);
            if (err.response || err.message) {
                 const errorMessage = err.response?.data?.message || ERROR_MESSAGES.ADD_ACCOUNT_FAILED;
                 setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                });
            }
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (accountId) => {
        setDeleteConfirmation({
            open: true,
            accountId
        });
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmation({
            open: false,
            accountId: null
        });
    };

    const handleConfirmDelete = async () => {
        const accountId = deleteConfirmation.accountId;
        setIsDeleting(true);

        // MOCK удаления счета
        setTimeout(() => {
            setAccounts(accounts.filter(a => a.id !== accountId));
            setSnackbar({
                open: true,
                message: SUCCESS_MESSAGES.ACCOUNT_DELETED,
                severity: 'success'
            });
            setIsDeleting(false);
            handleCloseDeleteConfirmation();
        }, 500);

        /* Настоящий вызов API
        try {
            await userService.deleteAccount(accountId);
            
            setSnackbar({
                open: true,
                message: SUCCESS_MESSAGES.ACCOUNT_DELETED,
                severity: 'success'
            });

            // Refresh accounts list
            const accountsRes = await userService.getAccounts();
            setAccounts(accountsRes.data);
            handleCloseDeleteConfirmation();
        } catch (err) {
            console.error('Error deleting account:', err);
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.DELETE_ACCOUNT_FAILED,
                severity: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
        */
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                <CircularProgress className={styles.loadingSpinner} />
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
                        className={styles.retryButton}
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
                {/* Заголовок профиля */}
                <div className={styles.headerSection}>
                    <div className={styles.headerContent}>
                        <div className={styles.userInfo}>
                            <Avatar className={styles.avatar}>
                                {profile ? getInitials(profile.fullName) : 'U'}
                            </Avatar>
                            <div className={styles.userDetails}>
                                <h1>{profile?.fullName || INFO_MESSAGES.DEFAULT_USER_NAME}</h1>
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

                {/* Секция с лицевыми счетами */}
                <div className={styles.contentSection}>
                    <div className={styles.sectionHeader}>
                        <Typography variant="h5" className={styles.sectionTitle}>
                            <WalletIcon className={styles.walletIcon} />
                            Мои лицевые счета
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            className={styles.addButton}
                            onClick={handleOpenAddAccount}
                        >
                            Добавить счет
                        </Button>
                    </div>

                    {accounts.length === 0 ? (
                        <Box className={styles.emptyAccounts}>
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
                                        <Tooltip title="Удалить счет">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDeleteClick(account.id)}
                                                className={styles.deleteButton}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <div className={styles.accountDetails}>
                                        <div className={styles.accountAddress}>
                                            <HomeIcon className={styles.addressIcon} fontSize="small" />
                                            {account.address}
                                        </div>
                                        <div className={styles.accountArea}>
                                            <AreaIcon className={styles.areaIcon} />
                                            {account.area} м²
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Paper>

            {/* Модальное окно добавления счета */}
            <Dialog 
                open={openAddAccount} 
                onClose={handleCloseAddAccount}
                className={styles.dialog}
            >
                <DialogTitle className={styles.dialogTitle}>
                    Добавить лицевой счет
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" className={styles.dialogContentText}>
                        Введите номер вашего лицевого счета для привязки к профилю.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Номер лицевого счета"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newAccountNumber}
                        onChange={(e) => setNewAccountNumber(e.target.value)}
                        error={!!addAccountError}
                        helperText={addAccountError}
                        className={styles.textField}
                    />
                </DialogContent>
                <DialogActions className={styles.dialogActions}>
                    <Button onClick={handleCloseAddAccount} className={styles.cancelButton}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleAddAccount} 
                        variant="contained"
                        disabled={isSubmitting}
                        className={styles.modalButton}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Привязать'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно подтверждения удаления */}
            <Dialog
                open={deleteConfirmation.open}
                onClose={handleCloseDeleteConfirmation}
                className={styles.dialog}
            >
                <DialogTitle className={styles.dialogTitle}>
                    Удаление счета
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" className={styles.deleteDialogText}>
                        Вы действительно хотите удалить этот лицевой счет? Это действие нельзя будет отменить.
                    </Typography>
                </DialogContent>
                <DialogActions className={styles.dialogActions}>
                    <Button onClick={handleCloseDeleteConfirmation} className={styles.cancelButton}>
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error"
                        disabled={isDeleting}
                        className={styles.deleteConfirmButton}
                    >
                        {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Снэкбар для уведомлений */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    className={styles.alert}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;
