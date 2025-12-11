import { 
    Typography, 
    DialogContent, 
    InputAdornment, 
    CircularProgress 
} from '@mui/material';
import { 
    AccountBalanceWallet as WalletIcon, 
    Numbers as NumbersIcon, 
    CalendarToday as CalendarIcon, 
    CreditCard as CardIcon 
} from '@mui/icons-material';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../../components/common';
import {
    PaymentModalContent,
    PaymentAmountContainer,
    PaymentWalletIconWrapper,
    ModalInfoSection,
    ModalInfoRow,
    PaymentInfoRowContent,
    PaymentInfoAvatar,
    PaymentInfoText,
    PaymentInput
} from '../Bills.styles';

const PaymentModal = ({ 
    open, 
    onClose, 
    bill, 
    amount, 
    onAmountChange, 
    error, 
    onSubmit, 
    isPaying,
    formatDate,
    formatCurrency
}) => {
    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
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
                            {bill && formatCurrency(bill.amount)}
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
                                    <Typography variant="body1" fontWeight="600">{bill?.accountNumber}</Typography>
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
                                    <Typography variant="body1" fontWeight="600">{bill && formatDate(bill.period)}</Typography>
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
                        value={amount}
                        onChange={onAmountChange}
                        error={!!error}
                        helperText={error}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CardIcon color="action" />
                                    </InputAdornment>
                                ),
                            },
                            htmlInput: {
                                max: bill?.amount,
                                min: 0.01,
                                step: 0.01,
                                style: { fontSize: '1.1rem', fontWeight: 500 }
                            }
                        }}
                    />
                </PaymentModalContent>
            </DialogContent>
            <GlassDialogActions>
                <GlassButton onClick={onClose} variant="text">
                    Отмена
                </GlassButton>
                <GlassButton 
                    onClick={onSubmit} 
                    variant="contained"
                    color="primary"
                    disabled={isPaying}
                >
                    {isPaying ? <CircularProgress size={24} /> : 'Оплатить'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default PaymentModal;
