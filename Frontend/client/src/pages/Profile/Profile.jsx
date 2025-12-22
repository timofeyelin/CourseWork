import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Typography, Button, CircularProgress } from '@mui/material';
import { userService } from '../../api';
import { ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES, INFO_MESSAGES } from '../../utils/constants';
import { accountValidationSchema } from '../../utils/validationSchemas';
import { 
    ProfileContainer, 
    ProfileCard, 
    LoadingContainer, 
    StyledAlert 
} from './Profile.styles';
import { AppSnackbar, ErrorBox } from '../../components/common';
import ProfileHeader from './components/ProfileHeader';
import AccountsList from './components/AccountsList';
import AddAccountModal from './components/AddAccountModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import ProfileEditModal from './components/ProfileEditModal';

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
    const [openEditProfile, setOpenEditProfile] = useState(false);

    const { isAdminOrOperator } = useAuth();

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate(ROUTES.LOGIN);
                return;
            }

            setLoading(true);
            const profileRes = await userService.getProfile();
            setProfile(profileRes.data);

            if (!(profileRes.data && (profileRes.data.role === 'Admin' || profileRes.data.role === 'Operator'))) {
                const accountsRes = await userService.getAccounts();
                setAccounts(accountsRes.data);
            } else {
                setAccounts([]);
            }
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
        setOpenEditProfile(true);
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

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    if (error) {
        return <ErrorBox message={error} onRetry={fetchProfileData} />;
    }

    return (
        <ProfileContainer compact={!!profile}>
            <ProfileCard elevation={0} compact={!!profile}>
                <ProfileHeader 
                    profile={profile} 
                    onEditProfile={handleEditProfile} 
                />

                {!isAdminOrOperator ? (
                    <AccountsList 
                        accounts={accounts} 
                        onAddAccount={handleOpenAddAccount} 
                        onDeleteAccount={handleDeleteClick} 
                        navigate={navigate} 
                    />
                ) : null}
            </ProfileCard>

                {!isAdminOrOperator ? (
                    <>
                        <AddAccountModal 
                            open={openAddAccount} 
                            onClose={handleCloseAddAccount} 
                            onAdd={handleAddAccount} 
                            accountNumber={newAccountNumber} 
                            setAccountNumber={setNewAccountNumber} 
                            error={addAccountError} 
                            isSubmitting={isSubmitting} 
                        />

                        <DeleteAccountModal 
                            open={deleteConfirmation.open} 
                            onClose={handleCloseDeleteConfirmation} 
                            onConfirm={handleConfirmDelete} 
                            isDeleting={isDeleting} 
                        />
                    </>
                ) : null}

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />

            <ProfileEditModal
                open={openEditProfile}
                onClose={() => setOpenEditProfile(false)}
                initialProfile={profile}
                onSaved={fetchProfileData}
                setSnackbar={setSnackbar}
            />
        </ProfileContainer>
    );
};

export default Profile;
