import { useState, useEffect } from 'react';
import { 
    Paper, 
    Typography, 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    Tooltip, 
    CircularProgress,
    DialogContent,
    Snackbar,
    Alert,
    InputAdornment
} from '@mui/material';
import { 
    ReceiptLong as BillIcon, 
    Visibility as ViewIcon, 
    Download as DownloadIcon, 
    Payment as PaymentIcon,
    FilterList as FilterIcon,
    AccountBalanceWallet as WalletIcon,
    CalendarToday as CalendarIcon,
    Numbers as NumbersIcon,
    CreditCard as CardIcon
} from '@mui/icons-material';
import { GlassButton, GlassIconButton, GlassDialog, GlassDialogTitle, GlassDialogActions, StatusPill, GlassSelect } from '../../../components/common';
import { billsService, userService } from '../../../api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../utils/constants';
import { paymentValidationSchema } from '../../../utils/validationSchemas';
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
    ErrorContainer,
    ErrorCard,
    ModalInfoSection,
    ModalInfoRow,
    BillDetailsTable,
    ModalTableCellHead,
    ModalTableCell,
    ModalTableRow,
    TotalAmount,
    PaymentInput,
    RetryButton,
    PaymentModalContent,
    PaymentAmountContainer,
    PaymentWalletIconWrapper,
    PaymentInfoRowContent,
    PaymentInfoAvatar,
    PaymentInfoText
} from './PaymentTab.styles';

const PaymentTab = ({ initialAccount }) => {
    const [bills, setBills] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [selectedAccount, setSelectedAccount] = useState('all');
    
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        if (initialAccount) {
            setSelectedAccount(initialAccount);
        }
    }, [initialAccount]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [billsRes, accountsRes] = await Promise.all([
                billsService.getBills(),
                userService.getAccounts()
            ]);
            
            const accountsData = accountsRes.data || [];
            setAccounts(accountsData);

            const billsData = billsRes.data.map(bill => {
                const account = accountsData.find(a => a.id === bill.accountId);
                return {
                    id: bill.billId,
                    period: bill.period,
                    accountNumber: account ? account.accountNumber : 'Н/Д',
                    amount: bill.totalAmount,
                    isPaid: bill.status === 1 || bill.status === 'Paid',
                    items: []
                };
            });
            
            setBills(billsData);
        } catch (err) {
            console.error('Error fetching bills data:', err);
            setError(ERROR_MESSAGES.BILLS_LOAD_FAILED);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccountFilterChange = (event) => {
        setSelectedAccount(event.target.value);
    };

    const filteredBills = selectedAccount === 'all' 
        ? bills 
        : bills.filter(bill => bill.accountNumber === selectedAccount);

    const handleViewDetails = async (bill) => {
        try {
            const res = await billsService.getBillDetails(bill.id);
            const details = res.data;
            
            setSelectedBill({
                ...bill,
                items: details.billItems.map(item => ({
                    service: item.serviceName,
                    tariff: item.tariff,
                    volume: item.consumption,
                    amount: item.amount
                }))
            });
            setDetailsModalOpen(true);
        } catch (err) {
            console.error('Error fetching bill details:', err);
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.BILL_DETAILS_LOAD_FAILED,
                severity: 'error'
            });
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
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.DOWNLOAD_RECEIPT_FAILED,
                severity: 'error'
            });
        }
    };

    const handleOpenPayment = (bill) => {
        setSelectedBill(bill);
        setPaymentAmount(bill.amount);
        setPaymentModalOpen(true);
        setPaymentError('');
    };

    const handleClosePayment = () => {
        setPaymentModalOpen(false);
        setSelectedBill(null);
        setPaymentAmount('');
    };

    const handlePaymentSubmit = async () => {
        try {
            paymentValidationSchema(paymentAmount, selectedBill.amount);
        } catch (validationErrors) {
            setPaymentError(validationErrors.amount);
            return;
        }

        setIsPaying(true);
        
        try {
            await billsService.payBill({
                billId: selectedBill.id,
                amount: Number(paymentAmount)
            });

            setSnackbar({
                open: true,
                message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
                severity: 'success'
            });
            
            handleClosePayment();
            fetchData(); // Refresh list
        } catch (err) {
            console.error('Payment error:', err);
            setPaymentError(err.response?.data?.message || ERROR_MESSAGES.PAYMENT_FAILED);
        } finally {
            setIsPaying(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
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
        <TabCard>
            {/* Заголовок страницы */}
            <HeaderSection>
                <PageTitle>
                    <BillIcon fontSize="large" />
                    Мои счета
                </PageTitle>
            </HeaderSection>

            {/* Фильтры и таблица */}
            <ContentSection>
                <FilterSection>
                    <FilterIcon color="action" />
                    <GlassSelect
                        label="Лицевой счет"
                        value={selectedAccount}
                        onChange={handleAccountFilterChange}
                        options={[
                            { value: 'all', label: 'Все счета' },
                            ...accounts.map(acc => ({ value: acc.accountNumber, label: acc.accountNumber }))
                        ]}
                    />
                </FilterSection>

                <StyledTableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableHeadCell>Период</StyledTableHeadCell>
                                <StyledTableHeadCell>Лицевой счет</StyledTableHeadCell>
                                <StyledTableHeadCell>Сумма</StyledTableHeadCell>
                                <StyledTableHeadCell>Статус</StyledTableHeadCell>
                                <StyledTableHeadCell align="right">Действия</StyledTableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBills.length === 0 ? (
                                <TableRow>
                                    <StyledTableCell colSpan={5} align="center">
                                        Счетов не найдено
                                    </StyledTableCell>
                                </TableRow>
                            ) : (
                                filteredBills.map((bill) => (
                                    <StyledTableRow key={bill.id} hover>
                                        <StyledTableCell>{formatDate(bill.period)}</StyledTableCell>
                                        <StyledTableCell>{bill.accountNumber}</StyledTableCell>
                                        <StyledTableCell>{formatCurrency(bill.amount)}</StyledTableCell>
                                        <StyledTableCell>
                                            <StatusPill status={bill.isPaid ? 'paid' : 'unpaid'}>
                                                {bill.isPaid ? 'Оплачено' : 'Не оплачено'}
                                            </StatusPill>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Tooltip title="Детали">
                                                <GlassIconButton 
                                                    size="small" 
                                                    onClick={() => handleViewDetails(bill)}
                                                >
                                                    <ViewIcon fontSize="small" />
                                                </GlassIconButton>
                                            </Tooltip>
                                            <Tooltip title="Скачать квитанцию">
                                                <GlassIconButton 
                                                    size="small" 
                                                    onClick={() => handleDownloadPdf(bill.id)}
                                                >
                                                    <DownloadIcon fontSize="small" />
                                                </GlassIconButton>
                                            </Tooltip>
                                            {!bill.isPaid && (
                                                <Tooltip title="Оплатить">
                                                    <GlassIconButton 
                                                        size="small" 
                                                        onClick={() => handleOpenPayment(bill)}
                                                    >
                                                        <PaymentIcon fontSize="small" />
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

            {/* Модальное окно деталей счета */}
            <GlassDialog 
                open={detailsModalOpen} 
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                <GlassDialogTitle>
                    Детали счета за {selectedBill && formatDate(selectedBill.period)}
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
                                <Typography variant="body1" color="textSecondary">Итого к оплате</Typography>
                                <Typography variant="h5" color="primary" fontWeight="700">
                                    {formatCurrency(selectedBill.amount)}
                                </Typography>
                            </TotalAmount>
                        </>
                    )}
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton 
                        onClick={() => handleDownloadPdf(selectedBill.id)}
                        startIcon={<DownloadIcon />}
                        variant="text"
                    >
                        Скачать квитанцию
                    </GlassButton>
                    <GlassButton onClick={handleCloseDetails} variant="text">
                        Закрыть
                    </GlassButton>
                    {selectedBill && !selectedBill.isPaid && (
                        <GlassButton 
                            variant="contained" 
                            color="primary"
                            onClick={() => {
                                handleCloseDetails();
                                handleOpenPayment(selectedBill);
                            }}
                        >
                            Оплатить
                        </GlassButton>
                    )}
                </GlassDialogActions>
            </GlassDialog>

            {/* Модальное окно оплаты */}
            <GlassDialog 
                open={paymentModalOpen} 
                onClose={handleClosePayment}
                maxWidth="sm"
                fullWidth
            >
                <GlassDialogTitle>Оплата счета</GlassDialogTitle>
                <DialogContent>
                    <PaymentModalContent>
                        <PaymentAmountContainer>
                            <PaymentWalletIconWrapper>
                                <WalletIcon />
                            </PaymentWalletIconWrapper>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Сумма к оплате
                            </Typography>
                            <Typography variant="h3" color="primary" fontWeight="700">
                                {selectedBill && formatCurrency(selectedBill.amount)}
                            </Typography>
                        </PaymentAmountContainer>

                        <ModalInfoSection>
                            <ModalInfoRow>
                                <PaymentInfoRowContent>
                                    <PaymentInfoAvatar>
                                        <NumbersIcon fontSize="small" />
                                    </PaymentInfoAvatar>
                                    <PaymentInfoText>
                                        <Typography variant="caption" color="textSecondary" display="block">Лицевой счет</Typography>
                                        <Typography variant="body1" fontWeight="600">{selectedBill?.accountNumber}</Typography>
                                    </PaymentInfoText>
                                </PaymentInfoRowContent>
                            </ModalInfoRow>
                            <ModalInfoRow>
                                <PaymentInfoRowContent>
                                    <PaymentInfoAvatar>
                                        <CalendarIcon fontSize="small" />
                                    </PaymentInfoAvatar>
                                    <PaymentInfoText>
                                        <Typography variant="caption" color="textSecondary" display="block">Период оплаты</Typography>
                                        <Typography variant="body1" fontWeight="600">{selectedBill && formatDate(selectedBill.period)}</Typography>
                                    </PaymentInfoText>
                                </PaymentInfoRowContent>
                            </ModalInfoRow>
                        </ModalInfoSection>
                        
                        <PaymentInput
                            autoFocus
                            margin="dense"
                            label="Сумма платежа"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            error={!!paymentError}
                            helperText={paymentError}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CardIcon color="action" />
                                        </InputAdornment>
                                    ),
                                },
                                htmlInput: {
                                    max: selectedBill?.amount,
                                    min: 0.01,
                                    step: 0.01
                                }
                            }}
                        />
                    </PaymentModalContent>
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton onClick={handleClosePayment} variant="text">
                        Отмена
                    </GlassButton>
                    <GlassButton 
                        onClick={handlePaymentSubmit} 
                        variant="contained"
                        color="primary"
                        disabled={isPaying}
                    >
                        {isPaying ? <CircularProgress size={24} /> : 'Оплатить'}
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
        </TabCard>
    );
};

export default PaymentTab;
