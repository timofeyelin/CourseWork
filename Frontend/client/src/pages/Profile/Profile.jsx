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
import { GlassButton, GlassDialog, GlassDialogTitle, GlassDialogActions, GlassInput } from '../../components/StyledComponents';
import {
    ProfileContainer,
    ProfileCard,
    HeaderSection,
    HeaderContent,
    UserInfo,
    StyledAvatar,
    UserDetails,
    UserEmail,
    RegistrationDate,
    ContentSection,
    SectionHeader,
    SectionTitle,
    EmptyAccounts,
    AccountsGrid,
    AccountCard,
    AccountHeader,
    AccountNumberLabel,
    AccountNumber,
    DeleteButton,
    AccountDetails,
    AccountAddress,
    AccountArea,
    LoadingContainer,
    ErrorContainer,
    ErrorCard,
    StyledAlert,
    AddAccountDescription
} from './Profile.styles';

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
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate(ROUTES.LOGIN);
                return;
            }

            setLoading(true);
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
        } finally {
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
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <ErrorCard>
                    <Typography color="error" variant="h6" gutterBottom>
                        Ошибка
                    </Typography>
                    <Typography variant="body1">
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => window.location.reload()}
                    >
                        Повторить
                    </Button>
                </ErrorCard>
            </ErrorContainer>
        );
    }

    return (
        <ProfileContainer>
            <ProfileCard elevation={0}>
                {/* Заголовок профиля */}
                <HeaderSection>
                    <HeaderContent>
                        <UserInfo>
                            <StyledAvatar>
                                {profile ? getInitials(profile.fullName) : 'U'}
                            </StyledAvatar>
                            <UserDetails>
                                <h1>{profile?.fullName || INFO_MESSAGES.DEFAULT_USER_NAME}</h1>
                                <UserEmail>{profile?.email}</UserEmail>
                                <RegistrationDate>
                                    На сайте с {new Date(profile?.createdAt).toLocaleDateString('ru-RU')}
                                </RegistrationDate>
                            </UserDetails>
                        </UserInfo>
                        <GlassButton 
                            variant="contained" 
                            startIcon={<EditIcon />}
                            color="primary"
                            onClick={handleEditProfile}
                        >
                            Редактировать
                        </GlassButton>
                    </HeaderContent>
                </HeaderSection>

                {/* Секция с лицевыми счетами */}
                <ContentSection>
                    <SectionHeader>
                        <SectionTitle variant="h5">
                            <WalletIcon />
                            Мои лицевые счета
                        </SectionTitle>
                        <GlassButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            color="primary"
                            onClick={handleOpenAddAccount}
                        >
                            Добавить счет
                        </GlassButton>
                    </SectionHeader>

                    {accounts.length === 0 ? (
                        <EmptyAccounts>
                            <Typography>У вас пока нет привязанных лицевых счетов.</Typography>
                        </EmptyAccounts>
                    ) : (
                        <AccountsGrid>
                            {accounts.map((account) => (
                                <AccountCard key={account.id}>
                                    <AccountHeader>
                                        <div>
                                            <AccountNumberLabel>Лицевой счет</AccountNumberLabel>
                                            <AccountNumber>{account.accountNumber}</AccountNumber>
                                        </div>
                                        <Tooltip title="Удалить счет">
                                            <DeleteButton 
                                                size="small" 
                                                onClick={() => handleDeleteClick(account.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </DeleteButton>
                                        </Tooltip>
                                    </AccountHeader>
                                    <AccountDetails>
                                        <AccountAddress>
                                            <HomeIcon fontSize="small" />
                                            {account.address}
                                        </AccountAddress>
                                        <AccountArea>
                                            <AreaIcon />
                                            {account.area} м²
                                        </AccountArea>
                                    </AccountDetails>
                                </AccountCard>
                            ))}
                        </AccountsGrid>
                    )}
                </ContentSection>
            </ProfileCard>

            {/* Модальное окно добавления счета */}
            <GlassDialog 
                open={openAddAccount} 
                onClose={handleCloseAddAccount}
            >
                <GlassDialogTitle>
                    Добавить лицевой счет
                </GlassDialogTitle>
                <DialogContent>
                    <AddAccountDescription variant="body2">
                        Введите номер вашего лицевого счета для привязки к профилю.
                    </AddAccountDescription>
                    <GlassInput
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
                    />
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton onClick={handleCloseAddAccount} variant="text">
                        Отмена
                    </GlassButton>
                    <GlassButton 
                        onClick={handleAddAccount} 
                        variant="contained"
                        disabled={isSubmitting}
                        color="primary"
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Привязать'}
                    </GlassButton>
                </GlassDialogActions>
            </GlassDialog>

            {/* Модальное окно подтверждения удаления */}
            <GlassDialog
                open={deleteConfirmation.open}
                onClose={handleCloseDeleteConfirmation}
            >
                <GlassDialogTitle>
                    Удаление счета
                </GlassDialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Вы действительно хотите удалить этот лицевой счет? Это действие нельзя будет отменить.
                    </Typography>
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton onClick={handleCloseDeleteConfirmation} variant="text">
                        Отмена
                    </GlassButton>
                    <GlassButton 
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Удалить'}
                    </GlassButton>
                </GlassDialogActions>
            </GlassDialog>

            {/* Снэкбар для уведомлений */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <StyledAlert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled"
                >
                    {snackbar.message}
                </StyledAlert>
            </Snackbar>
        </ProfileContainer>
    );
};

export default Profile;
