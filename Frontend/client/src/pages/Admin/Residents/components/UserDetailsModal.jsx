import React, { useState } from 'react';
import { 
    DialogContent, DialogActions, Button, 
    List, ListItemText, IconButton,
    Typography, CircularProgress
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { adminService } from '../../../../api';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton, GlassIconButton } from '../../../../components/common';
import { RESIDENTS_MESSAGES } from '../../../../utils/constants';
import { 
    ModalContentBox, 
    AddAccountBox, 
    StyledAccountInput, 
    SectionTitle, 
    StyledListItem 
} from '../Residents.styles';

const UserDetailsModal = ({ open, onClose, user, onUpdate, setSnackbar }) => {
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLinkAccount = async () => {
        if (!newAccountNumber) return;
        setLoading(true);
        try {
            await adminService.linkAccount(user.id, newAccountNumber);
            setSnackbar({ open: true, message: RESIDENTS_MESSAGES.ACCOUNT_LINKED, severity: 'success' });
            setNewAccountNumber('');
            onUpdate();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data || RESIDENTS_MESSAGES.ACCOUNT_LINK_FAILED, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkAccount = async (accountId) => {
        setLoading(true);
        try {
            await adminService.unlinkAccount(user.id, accountId);
            setSnackbar({ open: true, message: RESIDENTS_MESSAGES.ACCOUNT_UNLINKED, severity: 'success' });
            onUpdate();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data || RESIDENTS_MESSAGES.ACCOUNT_UNLINK_FAILED, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <GlassDialogTitle>Подробности пользователя</GlassDialogTitle>
            <DialogContent>
                <ModalContentBox>
                    <Typography variant="h6" gutterBottom>{user.fullName}</Typography>
                    <Typography variant="body2" color="textSecondary">Телефон: {user.phone}</Typography>
                </ModalContentBox>
                
                <SectionTitle variant="h6">Привязанные лицевые счета</SectionTitle>
                
                <AddAccountBox>
                    <StyledAccountInput
                        label="Номер лицевого счета"
                        value={newAccountNumber}
                        onChange={(e) => setNewAccountNumber(e.target.value)}
                    />
                    <GlassButton
                        variant="contained"
                        color="primary"
                        onClick={handleLinkAccount}
                        disabled={loading || !newAccountNumber}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Add />}
                        sx={{ height: '56px', borderRadius: '12px', minWidth: 140 }}
                    >
                        Добавить
                    </GlassButton>
                </AddAccountBox>

                <List>
                    {user.accounts && user.accounts.map((account) => (
                            <StyledListItem
                                key={account.id}
                                secondaryAction={
                                    <GlassIconButton edge="end" onClick={() => handleUnlinkAccount(account.id)} disabled={loading} color="error">
                                        <Delete />
                                    </GlassIconButton>
                                }
                            >
                                <ListItemText 
                                    primary={`ЛС: ${account.accountNumber}`} 
                                    secondary={account.address} 
                                />
                            </StyledListItem>
                    ))}
                    {(!user.accounts || user.accounts.length === 0) && (
                        <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                            Нет привязанных счетов
                        </Typography>
                    )}
                </List>
            </DialogContent>
            <GlassDialogActions sx={{ p: 3 }}>
                <GlassButton onClick={onClose} variant="text" color="inherit">Закрыть</GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default UserDetailsModal;
