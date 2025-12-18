import { useState, useEffect } from 'react';
import { 
    Typography, 
    CircularProgress
} from '@mui/material';
import { 
    ReceiptLong as BillIcon, 
    FilterList as FilterIcon
} from '@mui/icons-material';
import { billsService, userService } from '../../api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';
import { paymentValidationSchema } from '../../utils/validationSchemas';
import {
    PageContainer,
    PageCard,
    HeaderSection,
    PageTitle,
    ContentSection,
    FilterSection,
    FilterControl,
    LoadingContainer
} from './Bills.styles';
import { ErrorBox } from '../../components/common';

import BillsTable from './components/BillsTable';
import { AppSnackbar, GlassSelect } from '../../components/common';
import BillDetailsModal from './components/BillDetailsModal';
import PaymentModal from './components/PaymentModal';

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
                    items: [] // Будут загружены при просмотре деталей
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
            fetchData();
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
        return <ErrorBox message={error} onRetry={() => window.location.reload()} />;
    }

    return (
        <PageContainer>
            <PageCard>
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
                        <FilterControl variant="outlined" size="small">
                            <GlassSelect
                                label="Лицевой счет"
                                value={selectedAccount}
                                onChange={handleAccountFilterChange}
                                options={[{ value: 'all', label: 'Все счета' }, ...accounts.map(acc => ({ value: acc.accountNumber, label: acc.accountNumber }))]}
                                size="small"
                            />
                        </FilterControl>
                    </FilterSection>

                    <BillsTable 
                        bills={filteredBills}
                        onViewDetails={handleViewDetails}
                        onDownloadPdf={handleDownloadPdf}
                        onOpenPayment={handleOpenPayment}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                    />
                </ContentSection>
            </PageCard>

            {/* Модальное окно деталей счета */}
            <BillDetailsModal 
                open={detailsModalOpen}
                onClose={handleCloseDetails}
                bill={selectedBill}
                onDownloadPdf={handleDownloadPdf}
                onOpenPayment={handleOpenPayment}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
            />

            {/* Модальное окно оплаты */}
            <PaymentModal 
                open={paymentModalOpen}
                onClose={handleClosePayment}
                bill={selectedBill}
                amount={paymentAmount}
                onAmountChange={(e) => setPaymentAmount(e.target.value)}
                error={paymentError}
                onSubmit={handlePaymentSubmit}
                isPaying={isPaying}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
            />

            {/* Снэкбар для уведомлений */}
            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </PageContainer>
    );
};

export default Bills;
