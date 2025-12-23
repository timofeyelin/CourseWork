import React, { useState } from 'react';
import { 
    Table, TableBody, TableHead, TableRow,
    Paper, Button, DialogContent, DialogContentText,
    MenuItem, CircularProgress, Typography, Box
} from '@mui/material';
import { Block, CheckCircle, Visibility } from '@mui/icons-material';
import { adminService } from '../../../../api';
import { GlassSelect } from '../../../../components/common';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../../../components/common';
import { RESIDENTS_MESSAGES } from '../../../../utils/constants';
import { 
    StyledTableContainer, 
    StyledTableRow, 
    StyledTableCell, 
    StyledTableHeadCell,
    UserStatusPill
} from '../Residents.styles';
import { ErrorBox } from '../../../../components/common';
import { GlassIconButton } from '../../../../components/common';

const ResidentsTable = ({ users, loading, error, onRefresh, setSnackbar, onDetails }) => {
    const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
    const [userToBlock, setUserToBlock] = useState(null);

    const handleBlockClick = (user) => {
        setUserToBlock(user);
        setBlockConfirmOpen(true);
    };

    const handleBlockConfirm = async () => {
        try {
            await adminService.blockUser(userToBlock.id, !userToBlock.isActive);
            const verb = userToBlock.isActive ? RESIDENTS_MESSAGES.USER_BLOCKED : RESIDENTS_MESSAGES.USER_UNBLOCKED;
            setSnackbar({ open: true, message: `Пользователь ${userToBlock.fullName} ${verb}`, severity: 'success' });
            onRefresh();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data || RESIDENTS_MESSAGES.STATUS_CHANGE_FAILED, severity: 'error' });
        } finally {
            setBlockConfirmOpen(false);
            setUserToBlock(null);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminService.changeRole(userId, newRole);
            setSnackbar({ open: true, message: RESIDENTS_MESSAGES.ROLE_CHANGE_SUCCESS, severity: 'success' });
            onRefresh();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data || RESIDENTS_MESSAGES.ROLE_CHANGE_FAILED, severity: 'error' });
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
    if (error) return <ErrorBox message={error} onRetry={onRefresh} />;

    return (
        <>
            <StyledTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableHeadCell>ФИО</StyledTableHeadCell>
                            <StyledTableHeadCell>Адрес/Квартира</StyledTableHeadCell>
                            <StyledTableHeadCell>ЛС</StyledTableHeadCell>
                            <StyledTableHeadCell>Телефон</StyledTableHeadCell>
                            <StyledTableHeadCell>Роль</StyledTableHeadCell>
                            <StyledTableHeadCell>Статус</StyledTableHeadCell>
                            <StyledTableHeadCell align="right">Действия</StyledTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <StyledTableRow key={user.id} hover>
                                <StyledTableCell>{user.fullName}</StyledTableCell>
                                <StyledTableCell>
                                    {user.addresses && user.addresses.length > 0 ? user.addresses.join(', ') : '-'}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {user.accountNumbers && user.accountNumbers.length > 0 ? user.accountNumbers.join(', ') : '-'}
                                </StyledTableCell>
                                <StyledTableCell>{user.phone}</StyledTableCell>
                                <StyledTableCell>
                                    <GlassSelect
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        sx={{ minWidth: 140 }}
                                    >
                                        <MenuItem value="Resident">Житель</MenuItem>
                                        <MenuItem value="Admin">Администратор</MenuItem>
                                        <MenuItem value="Operator">Оператор</MenuItem>
                                    </GlassSelect>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <UserStatusPill isActive={user.isActive}>
                                        {user.isActive ? "Активен" : "Заблокирован"}
                                    </UserStatusPill>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Box display="flex" justifyContent="flex-end" gap={1}>
                                        <GlassIconButton 
                                            size="small" 
                                            onClick={() => onDetails(user)}
                                            title="Подробности"
                                        >
                                            <Visibility fontSize="small" />
                                        </GlassIconButton>
                                        <GlassIconButton 
                                            size="small" 
                                            color={user.isActive ? "error" : "success"}
                                            onClick={() => handleBlockClick(user)}
                                            title={user.isActive ? "Заблокировать" : "Разблокировать"}
                                        >
                                            {user.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                                        </GlassIconButton>
                                    </Box>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <StyledTableCell colSpan={7} align="center">
                                    Пользователи не найдены
                                </StyledTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            <GlassDialog
                open={blockConfirmOpen}
                onClose={() => setBlockConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <GlassDialogTitle>
                    {userToBlock?.isActive ? 'Блокировка пользователя' : 'Разблокировка пользователя'}
                </GlassDialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите {userToBlock?.isActive ? 'заблокировать' : 'разблокировать'} пользователя <b>{userToBlock?.fullName}</b>?
                    </DialogContentText>
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton onClick={() => setBlockConfirmOpen(false)} variant="text" color="inherit">
                        Отмена
                    </GlassButton>
                    <GlassButton
                        onClick={handleBlockConfirm}
                        variant="contained"
                        color={userToBlock?.isActive ? 'error' : 'primary'}
                        autoFocus
                    >
                        {userToBlock?.isActive ? 'Заблокировать' : 'Разблокировать'}
                    </GlassButton>
                </GlassDialogActions>
            </GlassDialog>
        </>
    );
};

export default ResidentsTable;
