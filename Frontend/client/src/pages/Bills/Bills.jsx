import { useState, useEffect } from 'react';
import { 
    Paper, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Button, 
    IconButton, 
    Tooltip, 
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    Box,
    Avatar,
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
import { billsService, userService } from '../../api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, INFO_MESSAGES, VALIDATION_MESSAGES } from '../../utils/constants';
import { paymentValidationSchema } from '../../utils/validationSchemas';
import styles from './Bills.module.css';

const Bills = () => {
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

    const fetchData = async () => {
        // Начало MOCK данных
        setTimeout(() => {
            setBills([
                {
                    id: 1,
                    period: '2025-10-01',
                    accountNumber: '1234567890',
                    amount: 5400.50,
                    isPaid: false,
                    items: [
                        { service: 'Водоснабжение', tariff: 50.0, volume: 10, amount: 500.0 },
                        { service: 'Электричество', tariff: 5.5, volume: 200, amount: 1100.0 },
                        { service: 'Отопление', tariff: 2500.0, volume: 1.5, amount: 3750.0 },
                        { service: 'Содержание жилья', tariff: 30.0, volume: 54.5, amount: 50.5 } 
                    ]
                },
                {
                    id: 2,
                    period: '2025-09-01',
                    accountNumber: '1234567890',
                    amount: 5200.00,
                    isPaid: true,
                    items: [
                         { service: 'Водоснабжение', tariff: 50.0, volume: 10, amount: 500.0 },
                         { service: 'Электричество', tariff: 5.5, volume: 200, amount: 1100.0 },
                    ]
                },
                {
                    id: 3,
                    period: '2025-10-01',
                    accountNumber: '0987654321',
                    amount: 3100.00,
                    isPaid: false,
                    items: []
                }
            ]);

            setAccounts([
                { id: 1, accountNumber: '1234567890' },
                { id: 2, accountNumber: '0987654321' }
            ]);
            setLoading(false);
        }, 800);
        // Конец MOCK данных

        /* Настоящий вызов API
        try {
            setLoading(true);
            const [billsRes, accountsRes] = await Promise.all([
                billsService.getBills(),
                userService.getAccounts()
            ]);
            
            setBills(billsRes.data);
            setAccounts(accountsRes.data || []);
        } catch (err) {
            console.error('Error fetching bills data:', err);
            setError(ERROR_MESSAGES.BILLS_LOAD_FAILED);
        } finally {
            setLoading(false);
        }
        */
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

    const handleViewDetails = (bill) => {
        setSelectedBill(bill);
        setDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsModalOpen(false);
        setSelectedBill(null);
    };

    const handleDownloadPdf = async (billId) => {
        // MOCK скачивания
        setSnackbar({
            open: true,
            message: INFO_MESSAGES.DOWNLOAD_RECEIPT_MOCK,
            severity: 'info'
        });
        
        /* Настоящий вызов API
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
        */
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
        
        // MOCK оплаты
        setTimeout(() => {
            setSnackbar({
                open: true,
                message: INFO_MESSAGES.PAYMENT_SUCCESS_MOCK,
                severity: 'success'
            });
            
            setBills(bills.map(b => 
                b.id === selectedBill.id 
                    ? { ...b, isPaid: true }
                    : b
            ));

            handleClosePayment();
            setIsPaying(false);
        }, 1000);

        /* Настоящий вызов API
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
        */
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
            <div className={styles.loadingContainer}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorCard}>
                    <Typography color="error" variant="h6">{error}</Typography>
                    <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Повторить</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Paper className={`${styles.pageCard} glass-card`}>
                <div className={styles.headerSection}>
                    <h1 className={styles.title}>
                        <BillIcon className={styles.titleIcon} fontSize="large" />
                        Мои счета
                    </h1>
                </div>

                <div className={styles.contentSection}>
                    <div className={styles.filterSection}>
                        <FilterIcon color="action" />
                        <FormControl variant="outlined" size="small" className={styles.filterControl}>
                            <InputLabel>Лицевой счет</InputLabel>
                            <Select
                                value={selectedAccount}
                                onChange={handleAccountFilterChange}
                                label="Лицевой счет"
                            >
                                <MenuItem value="all">Все счета</MenuItem>
                                {accounts.map(acc => (
                                    <MenuItem key={acc.id} value={acc.accountNumber}>
                                        {acc.accountNumber}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <TableContainer className={styles.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.tableHeadCell}>Период</TableCell>
                                    <TableCell className={styles.tableHeadCell}>Лицевой счет</TableCell>
                                    <TableCell className={styles.tableHeadCell}>Сумма</TableCell>
                                    <TableCell className={styles.tableHeadCell}>Статус</TableCell>
                                    <TableCell align="right" className={styles.tableHeadCell}>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBills.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" className={styles.tableCell}>
                                            Счетов не найдено
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBills.map((bill) => (
                                        <TableRow key={bill.id} hover className={styles.tableRow}>
                                            <TableCell className={styles.tableCell}>{formatDate(bill.period)}</TableCell>
                                            <TableCell className={styles.tableCell}>{bill.accountNumber}</TableCell>
                                            <TableCell className={styles.tableCell}>{formatCurrency(bill.amount)}</TableCell>
                                            <TableCell className={styles.tableCell}>
                                                <span className={bill.isPaid ? "status-pill paid" : "status-pill unpaid"}>
                                                    {bill.isPaid ? 'Оплачено' : 'Не оплачено'}
                                                </span>
                                            </TableCell>
                                            <TableCell align="right" className={styles.tableCell}>
                                                <Tooltip title="Детали">
                                                    <IconButton 
                                                        size="small" 
                                                        className="btn-glass-icon"
                                                        onClick={() => handleViewDetails(bill)}
                                                    >
                                                        <ViewIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Скачать квитанцию">
                                                    <IconButton 
                                                        size="small" 
                                                        className="btn-glass-icon"
                                                        onClick={() => handleDownloadPdf(bill.id)}
                                                    >
                                                        <DownloadIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {!bill.isPaid && (
                                                    <Tooltip title="Оплатить">
                                                        <IconButton 
                                                            size="small" 
                                                            className="btn-glass-icon"
                                                            onClick={() => handleOpenPayment(bill)}
                                                        >
                                                            <PaymentIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Paper>

            {/* Модальное окно деталей счета */}
            <Dialog 
                open={detailsModalOpen} 
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
                className="glass-dialog"
            >
                <DialogTitle className="glass-dialog-title">
                    Детали счета за {selectedBill && formatDate(selectedBill.period)}
                </DialogTitle>
                <DialogContent>
                    {selectedBill && (
                        <>
                            <div className={styles.modalInfoSection}>
                                <div className={styles.modalInfoRow}>
                                    <Typography variant="body2" color="textSecondary">Лицевой счет</Typography>
                                    <Typography variant="body1" fontWeight="600">{selectedBill.accountNumber}</Typography>
                                </div>
                            </div>
                            
                            <TableContainer component={Paper} variant="outlined" className={styles.billDetailsTable}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={styles.modalTableCellHead}>Услуга</TableCell>
                                            <TableCell align="right" className={styles.modalTableCellHead}>Тариф</TableCell>
                                            <TableCell align="right" className={styles.modalTableCellHead}>Объем</TableCell>
                                            <TableCell align="right" className={styles.modalTableCellHead}>Сумма</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedBill.items && selectedBill.items.map((item, index) => (
                                            <TableRow key={index} className={styles.modalTableRow}>
                                                <TableCell className={styles.modalTableCell}>{item.service}</TableCell>
                                                <TableCell align="right" className={styles.modalTableCell}>{item.tariff}</TableCell>
                                                <TableCell align="right" className={styles.modalTableCell}>{item.volume}</TableCell>
                                                <TableCell align="right" className={styles.modalTableCell}>{formatCurrency(item.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                            <div className={styles.totalAmount}>
                                <Typography variant="body1" color="textSecondary">Итого к оплате</Typography>
                                <Typography variant="h5" color="primary" fontWeight="700">
                                    {formatCurrency(selectedBill.amount)}
                                </Typography>
                            </div>
                        </>
                    )}
                </DialogContent>
                <DialogActions className="glass-dialog-actions">
                    <Button 
                        onClick={() => handleDownloadPdf(selectedBill.id)}
                        startIcon={<DownloadIcon />}
                        className="btn-glass-secondary"
                    >
                        Скачать квитанцию
                    </Button>
                    <Button onClick={handleCloseDetails} className="btn-glass-secondary">
                        Закрыть
                    </Button>
                    {selectedBill && !selectedBill.isPaid && (
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                handleCloseDetails();
                                handleOpenPayment(selectedBill);
                            }}
                            className="btn-glass-primary"
                        >
                            Оплатить
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Модальное окно оплаты */}
            <Dialog 
                open={paymentModalOpen} 
                onClose={handleClosePayment}
                className="glass-dialog"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className="glass-dialog-title">Оплата счета</DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Box sx={{ mb: 3 }}>
                            <WalletIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1, opacity: 0.8 }} />
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Сумма к оплате
                            </Typography>
                            <Typography variant="h3" color="primary" fontWeight="700">
                                {selectedBill && formatCurrency(selectedBill.amount)}
                            </Typography>
                        </Box>

                        <div className={styles.modalInfoSection}>
                            <div className={styles.modalInfoRow}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'rgba(2, 136, 209, 0.1)', color: 'primary.main', width: 40, height: 40 }}>
                                        <NumbersIcon fontSize="small" />
                                    </Avatar>
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="caption" color="textSecondary" display="block">Лицевой счет</Typography>
                                        <Typography variant="body1" fontWeight="600">{selectedBill?.accountNumber}</Typography>
                                    </Box>
                                </Box>
                            </div>
                            <div className={styles.modalInfoRow}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'rgba(2, 136, 209, 0.1)', color: 'primary.main', width: 40, height: 40 }}>
                                        <CalendarIcon fontSize="small" />
                                    </Avatar>
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="caption" color="textSecondary" display="block">Период оплаты</Typography>
                                        <Typography variant="body1" fontWeight="600">{selectedBill && formatDate(selectedBill.period)}</Typography>
                                    </Box>
                                </Box>
                            </div>
                        </div>
                        
                        <TextField
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
                            className={`${styles.paymentInput} glass-input`}
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
                                    step: 0.01,
                                    style: { fontSize: '1.1rem', fontWeight: 500 }
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions className="glass-dialog-actions">
                    <Button onClick={handleClosePayment} className="btn-glass-secondary">
                        Отмена
                    </Button>
                    <Button 
                        onClick={handlePaymentSubmit} 
                        variant="contained"
                        disabled={isPaying}
                        className="btn-glass-primary"
                    >
                        {isPaying ? <CircularProgress size={24} /> : 'Оплатить'}
                    </Button>
                </DialogActions>
            </Dialog>

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
        </div>
    );
};

export default Bills;
