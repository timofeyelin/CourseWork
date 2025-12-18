import { useState, useEffect } from 'react';
import { 
    Typography, 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    Tooltip, 
    CircularProgress,
    DialogContent
} from '@mui/material';
import { 
    History as HistoryIcon, 
    FilterList as FilterIcon,
    CreditCard as CardIcon,
    Cancel as CancelIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { GlassButton, GlassIconButton, GlassDialog, GlassDialogTitle, GlassDialogActions, StatusPill, GlassSelect, GlassDatePicker, AppSnackbar } from '../../../components/common';
import { paymentsService, billsService, userService } from '../../../api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../utils/constants';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import {
    TabCard,
    HeaderSection,
    PageTitle,
    ContentSection,
    FilterSection,
    StyledTableContainer,
    StyledTableHeadCell,
    StyledTableRow,
    StyledTableCell,
    LoadingContainer,
    StyledGlassDatePicker
} from './HistoryTab.styles';
import { ErrorBox } from '../../../components/common';

const HistoryTab = ({ initialAccount }) => {
    const [payments, setPayments] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [statusFilter, setStatusFilter] = useState('all');
    const [accountFilter, setAccountFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        if (initialAccount) {
            setAccountFilter(initialAccount);
        }
    }, [initialAccount]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [paymentsRes, billsRes, accountsRes] = await Promise.all([
                paymentsService.getHistory(),
                billsService.getBills(),
                userService.getAccounts()
            ]);

            const bills = billsRes.data || [];
            const accountsData = accountsRes.data || [];
            setAccounts(accountsData);
            
            const paymentsData = (paymentsRes.data || []).map(payment => {
                const bill = bills.find(b => b.billId === payment.billId);
                const account = bill ? accountsData.find(a => a.id === bill.accountId) : null;
                
                let statusStr = 'Pending';
                if (payment.status === 1) statusStr = 'Paid';
                if (payment.status === 2) statusStr = 'Cancelled';

                return {
                    id: payment.paymentId,
                    date: payment.createdAt,
                    amount: payment.amount,
                    status: statusStr,
                    accountNumber: account ? account.accountNumber : 'Н/Д'
                };
            });

            setPayments(paymentsData);
        } catch (err) {
            console.error('Error fetching payment history:', err);
            setError(`${ERROR_MESSAGES.PAYMENT_HISTORY_LOAD_FAILED}: ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleAccountFilterChange = (event) => {
        setAccountFilter(event.target.value);
    };

    const filteredPayments = payments.filter(payment => {
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        const matchesAccount = accountFilter === 'all' || payment.accountNumber === accountFilter;
        
        let matchesDate = true;
        const paymentDate = dayjs(payment.date);
        
        if (dateFrom) {
            matchesDate = matchesDate && paymentDate.isSameOrAfter(dateFrom, 'day');
        }
        if (dateTo) {
            matchesDate = matchesDate && paymentDate.isSameOrBefore(dateTo, 'day');
        }

        return matchesStatus && matchesDate && matchesAccount;
    });

    const handleCancelClick = (payment) => {
        setSelectedPayment(payment);
        setCancelDialogOpen(true);
    };

    const handleCancelConfirm = async () => {
        setIsProcessing(true);

        try {
            await paymentsService.cancelPayment(selectedPayment.id);
            
            setPayments(payments.map(p => 
                p.id === selectedPayment.id 
                    ? { ...p, status: 'Cancelled' }
                    : p
            ));
            
            setSnackbar({
                open: true,
                message: SUCCESS_MESSAGES.PAYMENT_CANCELLED,
                severity: 'success'
            });
            setCancelDialogOpen(false);
            setSelectedPayment(null);
        } catch (err) {
            console.error('Error cancelling payment:', err);
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.PAYMENT_CANCEL_FAILED,
                severity: 'error'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Pending': return 'Ожидает обработки';
            case 'Paid': return 'Оплачено';
            case 'Cancelled': return 'Отменено';
            default: return status;
        }
    };

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    if (error) {
        return <ErrorBox message={error} onRetry={() => window.location.reload()} />;
    }

    return (
        <TabCard>
            {/* Заголовок страницы */}
            <HeaderSection>
                <PageTitle>
                    <HistoryIcon fontSize="large" />
                    История платежей
                </PageTitle>
            </HeaderSection>

            {/* Фильтры и таблица */}
            <ContentSection>
                <FilterSection>
                    <FilterIcon color="action" />
                    
                    <GlassSelect
                        label="Лицевой счет"
                        value={accountFilter}
                        onChange={handleAccountFilterChange}
                        options={[
                            { value: 'all', label: 'Все счета' },
                            ...(accounts || []).map(acc => ({ value: acc.accountNumber, label: acc.accountNumber }))
                        ]}
                    />

                    <GlassSelect
                        label="Статус"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        options={[
                            { value: 'all', label: 'Все статусы' },
                            { value: 'Pending', label: 'Ожидает обработки' },
                            { value: 'Paid', label: 'Оплачено' },
                            { value: 'Cancelled', label: 'Отменено' }
                        ]}
                    />
                    
                    <StyledGlassDatePicker
                        label="С даты"
                        value={dateFrom}
                        onChange={(newValue) => setDateFrom(newValue)}
                    />
                    
                    <StyledGlassDatePicker
                        label="По дату"
                        value={dateTo}
                        onChange={(newValue) => setDateTo(newValue)}
                    />
                </FilterSection>

                <StyledTableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableHeadCell>Дата</StyledTableHeadCell>
                                <StyledTableHeadCell>ЛС</StyledTableHeadCell>
                                <StyledTableHeadCell>Сумма</StyledTableHeadCell>
                                <StyledTableHeadCell>Статус</StyledTableHeadCell>
                                <StyledTableHeadCell align="right">Действия</StyledTableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPayments.length === 0 ? (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={5}>
                                        <Typography>Платежи не найдены</Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ) : (
                                filteredPayments.map(payment => (
                                    <StyledTableRow key={payment.id}>
                                        <StyledTableCell>{formatDate(payment.date)}</StyledTableCell>
                                        <StyledTableCell>{payment.accountNumber}</StyledTableCell>
                                        <StyledTableCell>{formatCurrency(payment.amount)}</StyledTableCell>
                                        <StyledTableCell>
                                            <StatusPill status={payment.status}>
                                                {getStatusLabel(payment.status)}
                                            </StatusPill>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {payment.status === 'Pending' && (
                                                <Tooltip title="Отменить платеж">
                                                    <GlassIconButton 
                                                        size="small" 
                                                        onClick={() => handleCancelClick(payment)}
                                                        disabled={isProcessing}
                                                    >
                                                        <CancelIcon fontSize="small" />
                                                    </GlassIconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Детали">
                                                <GlassIconButton size="small">
                                                    <InfoIcon fontSize="small" />
                                                </GlassIconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </ContentSection>

            {/* Диалог подтверждения отмены */}
            <GlassDialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
            >
                <GlassDialogTitle>Отмена платежа</GlassDialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите отменить платеж на сумму {selectedPayment && formatCurrency(selectedPayment.amount)}?
                    </Typography>
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton onClick={() => setCancelDialogOpen(false)} variant="text">
                        Нет, оставить
                    </GlassButton>
                    <GlassButton 
                        onClick={handleCancelConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isProcessing}
                    >
                        Да, отменить
                    </GlassButton>
                </GlassDialogActions>
            </GlassDialog>

            {/* Снэкбар для уведомлений */}
            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </TabCard>
    );
};

export default HistoryTab;
