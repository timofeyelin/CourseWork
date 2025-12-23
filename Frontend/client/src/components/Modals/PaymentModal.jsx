import { useState } from 'react';
import { MenuItem, IconButton, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { GlassInput, GlassSelect, GlassButton, GlassDialogTitle } from '../common';
import {
    StyledAlert,
    Form,
    FormField,
    FieldLabel,
} from './Auth.styles';
import { StyledDialog, ModalLoginCard } from './Modal.styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import {
    ModalHeader,
    ModalIconWrapper,
    ModalSubtitle,
    ModalCloseButton
} from '../../pages/Operator/Announcements/OperatorAnnouncements.styles';
import { paymentService } from '../../api/payments';

const PAYMENT_METHODS = [
    { value: 'Card', label: 'Банковская карта' },
    { value: 'SBP', label: 'СБП' },
];

const PaymentModal = ({ open, onClose, onSuccess, accountId }) => {
    const { selectedAccountId, accounts } = useAuth();
    const targetAccountId = accountId || selectedAccountId;
    const targetAccount = accounts?.find(acc => acc.id === targetAccountId);

    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('Card');
    const [error, setError] = useState(null);
    const [amountError, setAmountError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setAmountError('');

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setAmountError('Сумма должна быть больше 0');
            setIsSubmitting(false);
            return;
        }
        if (numAmount > 100000) {
            setAmountError('Сумма не может превышать 100 000');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await paymentService.initPayment(numAmount, method, targetAccountId);
            console.log('Payment URL:', response.testUrl);
            
            if (onSuccess) onSuccess();
            onClose();
            // window.open(response.testUrl, '_blank');

        } catch (err) {
            setError('Не удалось инициировать оплату, попробуйте позже');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StyledDialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            scroll="body"
        >
            <ModalLoginCard elevation={3}>
                <ModalHeader>
                    <ModalCloseButton>
                        <IconButton aria-label="close" onClick={onClose} size="large">
                            <CloseIcon />
                        </IconButton>
                    </ModalCloseButton>
                    <ModalIconWrapper>
                        <AccountBalanceWalletIcon color="primary" />
                    </ModalIconWrapper>
                    <GlassDialogTitle>Пополнение баланса</GlassDialogTitle>
                    {targetAccount && (
                        <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 1 }}>
                            Лицевой счет: {targetAccount.accountNumber}
                        </Typography>
                    )}
                    <ModalSubtitle>Введите сумму и выберите способ оплаты</ModalSubtitle>
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                    {error && <StyledAlert severity="error">{error}</StyledAlert>}

                    <FormField>
                        <GlassInput
                            label="Сумма пополнения"
                            fullWidth
                            placeholder="Введите сумму"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setAmountError('');
                            }}
                            type="number"
                            required
                            error={!!amountError}
                            helperText={amountError}
                        />
                    </FormField>

                    <FormField>
                        <GlassSelect
                            label="Способ оплаты"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            options={PAYMENT_METHODS}
                            fullWidth
                        />
                    </FormField>

                    <GlassButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting || !amount}
                        size="large"
                    >
                        {isSubmitting ? 'Обработка...' : 'Оплатить'}
                    </GlassButton>
                </Form>
            </ModalLoginCard>
        </StyledDialog>
    );
};

export default PaymentModal;
