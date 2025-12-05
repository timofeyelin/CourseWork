import { useState, useEffect } from 'react';
import { 
    Typography, 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    Tooltip, 
    CircularProgress,
    Select,
    MenuItem,
    InputLabel,
    DialogContent,
    Snackbar,
    Alert,
} from '@mui/material';
import { 
    History as HistoryIcon, 
    FilterList as FilterIcon,
    Cancel as CancelIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { GlassButton, GlassIconButton, GlassDialog, GlassDialogTitle, GlassDialogActions, StatusPill } from '../../components/common';
import { paymentsService, billsService, userService } from '../../api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';
import {
    PageContainer,
    PageCard,
    HeaderSection,
    PageTitle,
    ContentSection,
    FilterSection,
    StyledFormControl,
    StyledTextField,
    StyledTableContainer,
    StyledTableHeadCell,
    StyledTableRow,
    StyledTableCell,
    LoadingContainer,
    ErrorContainer,
    ErrorCard,
    RetryButton
} from './PaymentHistory.styles';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [paymentsRes, billsRes, accountsRes] = await Promise.all([
                paymentsService.getHistory(),
                billsService.getBills(),
                userService.getAccounts()
            ]);

            const bills = billsRes.data;
            const accounts = accountsRes.data;
            
            const paymentsData = paymentsRes.data.map(payment => {
                const bill = bills.find(b => b.billId === payment.billId);
                const account = bill ? accounts.find(a => a.id === bill.accountId) : null;
                
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

    const filteredPayments = payments.filter(payment => {
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        
        let matchesDate = true;
        const paymentDate = new Date(payment.date);
        
        if (dateFrom) {
            matchesDate = matchesDate && paymentDate >= new Date(dateFrom);
        }
        if (dateTo) {
            // Добавляем конец дня для корректного сравнения
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && paymentDate <= toDate;
        }

        return matchesStatus && matchesDate;
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
        return (
            <ErrorContainer>
                <ErrorCard>
                    <Typography color="error" variant="h6">{error}</Typography>
                    <RetryButton onClick={() => window.location.reload()}>Повторить</RetryButton>
                </ErrorCard>
            </ErrorContainer>
        );
    }

    return (
        <PageContainer>
            <PageCard>
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
                        <StyledFormControl variant="outlined" size="small">
                            <InputLabel>Статус</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Статус"
                            >
                                <MenuItem value="all">Все статусы</MenuItem>
                                <MenuItem value="Pending">Ожидает обработки</MenuItem>
                                <MenuItem value="Paid">Оплачено</MenuItem>
                                <MenuItem value="Cancelled">Отменено</MenuItem>
                            </Select>
                        </StyledFormControl>
                        
                        <StyledTextField
                            label="С даты"
                            type="date"
                            size="small"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        
                        <StyledTextField
                            label="По дату"
                            type="date"
                            size="small"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            InputLabelProps={{ shrink: true }}
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
                                    <TableRow>
                                        <StyledTableCell colSpan={5} align="center">
                                            Платежей не найдено
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <StyledTableRow key={payment.id} hover>
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
                                                    <>
                                                        <Tooltip title="Отменить платеж">
                                                            <GlassIconButton 
                                                                size="small" 
                                                                onClick={() => handleCancelClick(payment)}
                                                                disabled={isProcessing}
                                                            >
                                                                <CancelIcon fontSize="small" />
                                                            </GlassIconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                                <Tooltip title="Детали">
                                                    <GlassIconButton 
                                                        size="small" 
                                                    >
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
            </PageCard>

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
        </PageContainer>
    );
};

export default PaymentHistory;
