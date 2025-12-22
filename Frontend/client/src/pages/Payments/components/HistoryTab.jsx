import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    Paper,
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
    Visibility as ViewIcon,
    Download as DownloadIcon
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
// reuse modal styles/components from PaymentTab
import {
    ModalInfoSection,
    ModalInfoRow,
    BillDetailsTable,
    ModalTableCellHead,
    ModalTableCell,
    ModalTableRow,
    TotalAmount
} from './PaymentTab.styles';
import { ErrorBox } from '../../../components/common';

const HistoryTab = ({ initialAccount }) => {
    const [payments, setPayments] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [statusFilter, setStatusFilter] = useState('all');
    const [accountFilter, setAccountFilter] = useState('all');
    const [searchParams, setSearchParams] = useSearchParams();
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        setAccountFilter(initialAccount || 'all');
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
            
            const paymentsData = (paymentsRes.data || [])
                .filter(payment => payment.billId != null)
                .map(payment => {
                const bill = bills.find(b => b.billId === payment.billId);
                const account = bill ? accountsData.find(a => a.id === bill.accountId) : null;
                
                let statusStr = 'Pending';
                if (payment.status === 1) statusStr = 'Paid';
                if (payment.status === 2) statusStr = 'Cancelled';

                return {
                    id: payment.paymentId,
                    billId: payment.billId,
                    date: payment.createdAt,
                    amount: payment.amount,
                    status: statusStr,
                    accountNumber: account ? account.accountNumber : 'Н/Д',
                    period: bill ? bill.period : null,
                    isPaid: payment.status === 1
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
        const value = event.target.value;
        setAccountFilter(value);
        try {
            const newParams = new URLSearchParams(searchParams);
            if (value === 'all') {
                newParams.delete('account');
            } else {
                newParams.set('account', value);
            }
            setSearchParams(newParams);
        } catch (e) {
            console.warn('Failed to update search params for account', e);
        }
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

    const handleViewDetails = async (payment) => {
        try {
            setSelectedPayment(payment);
            const res = await billsService.getBillDetails(payment.billId);
            const details = res.data;

            setSelectedBill({
                id: payment.billId,
                accountNumber: payment.accountNumber,
                period: payment.period,
                amount: payment.amount,
                isPaid: payment.isPaid,
                items: details.billItems.map(item => ({
                    service: item.serviceName,
                    tariff: item.tariff,
                    volume: item.consumption,
                    amount: item.amount
                }))
            });

            setDetailsModalOpen(true);
        } catch (err) {
            console.error('Error fetching bill details for payment history:', err);
            setSnackbar({ open: true, message: ERROR_MESSAGES.BILL_DETAILS_LOAD_FAILED, severity: 'error' });
        }
    };

    const handleCloseDetails = () => {
        setDetailsModalOpen(false);
        setSelectedBill(null);
    };

    const handleDownloadPdf = async (billId) => {
        try {
            const response = await billsService.getBillPdf(billId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bill-${billId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error downloading PDF:', err);
            setSnackbar({ open: true, message: ERROR_MESSAGES.DOWNLOAD_RECEIPT_FAILED, severity: 'error' });
        }
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
        return <ErrorBox message={error} onRetry={fetchData} />;
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
                                            {payment.status === 'Cancelled' ? (
                                                <Typography>-</Typography>
                                            ) : (
                                                <Tooltip title="Детали">
                                                    <GlassIconButton size="small" onClick={() => handleViewDetails(payment)}>
                                                        <ViewIcon fontSize="small" />
                                                    </GlassIconButton>
                                                </Tooltip>
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </ContentSection>

            {/* Модальное окно деталей */}
            <GlassDialog 
                open={detailsModalOpen} 
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                <GlassDialogTitle>
                    {selectedPayment ? `Детали оплаты счета ${formatDate(selectedPayment.date)}` : 'Детали'}
                </GlassDialogTitle>
                <DialogContent>
                    {selectedBill && (
                        <>
                            <ModalInfoSection>
                                <ModalInfoRow>
                                    <Typography variant="body2" color="textSecondary">Лицевой счет</Typography>
                                    <Typography variant="body1" fontWeight="600">{selectedBill.accountNumber}</Typography>
                                </ModalInfoRow>
                            </ModalInfoSection>
                            
                            <BillDetailsTable component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <ModalTableCellHead>Услуга</ModalTableCellHead>
                                            <ModalTableCellHead align="right">Тариф</ModalTableCellHead>
                                            <ModalTableCellHead align="right">Объем</ModalTableCellHead>
                                            <ModalTableCellHead align="right">Сумма</ModalTableCellHead>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedBill.items && selectedBill.items.map((item, index) => (
                                            <ModalTableRow key={index}>
                                                <ModalTableCell>{item.service}</ModalTableCell>
                                                <ModalTableCell align="right">{item.tariff}</ModalTableCell>
                                                <ModalTableCell align="right">{item.volume}</ModalTableCell>
                                                <ModalTableCell align="right">{formatCurrency(item.amount)}</ModalTableCell>
                                            </ModalTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </BillDetailsTable>
                            
                            <TotalAmount>
                                <Typography variant="body1" color="textSecondary">
                                    {selectedBill.isPaid ? 'Оплачено' : 'Итого к оплате'}
                                </Typography>
                                <Typography variant="h5" color="primary" fontWeight="700">
                                    {formatCurrency(selectedBill.amount)}
                                </Typography>
                            </TotalAmount>
                        </>
                    )}
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton 
                        onClick={() => handleDownloadPdf(selectedBill?.id)}
                        startIcon={<DownloadIcon />}
                        variant="text"
                    >
                        Скачать квитанцию
                    </GlassButton>
                    <GlassButton onClick={handleCloseDetails} variant="text">
                        Закрыть
                    </GlassButton>
                </GlassDialogActions>
            </GlassDialog>

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
