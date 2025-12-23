import { Box, Typography, IconButton } from '@mui/material';
import { AccountBalanceWallet, Assignment, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { 
    WidgetsGrid, 
    WidgetCard, 
    WidgetHeader, 
    WidgetTitle, 
    WidgetValue, 
    WidgetIcon 
} from '../Home.styles';

const StatsWidgets = ({ balanceData, openRequestsCount, onPaymentClick }) => {
    const { user, accounts, selectedAccountId } = useAuth();
    const isAdminOrOperator = user?.role === 'Admin' || user?.role === 'Operator';
    
    const selectedAccount = accounts?.find(acc => acc.id === selectedAccountId);

    if (isAdminOrOperator) return null;

    return (
        <WidgetsGrid>
            <WidgetCard color="#0288D1">
                <WidgetHeader>
                    <Box>
                        <WidgetTitle>Баланс</WidgetTitle>
                        {selectedAccount && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                Л/С: {selectedAccount.accountNumber}
                            </Typography>
                        )}
                    </Box>
                    <WidgetIcon color="#0288D1">
                        <AccountBalanceWallet />
                    </WidgetIcon>
                </WidgetHeader>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                        <WidgetValue color={balanceData.debt > 0 ? "#d32f2f" : "#2e7d32"}>
                            {balanceData.balance > 0 ? balanceData.balance.toLocaleString('ru-RU') : '0'} ₽
                        </WidgetValue>
                        <Typography variant="caption" color={balanceData.debt > 0 ? "error" : "text.secondary"}>
                            {balanceData.debt > 0 
                                ? `Задолженность: ${balanceData.debt.toLocaleString('ru-RU')} ₽` 
                                : 'Все оплачено'}
                        </Typography>
                    </Box>
                    <IconButton 
                        size="small" 
                        onClick={(e) => {
                            e.currentTarget.blur();
                            onPaymentClick();
                        }}
                        sx={{ 
                            backgroundColor: 'rgba(2, 136, 209, 0.1)',
                            color: '#0288D1',
                            '&:hover': {
                                backgroundColor: 'rgba(2, 136, 209, 0.2)',
                            }
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </WidgetCard>

            <WidgetCard color="#FF9800">
                <WidgetHeader>
                    <WidgetTitle>Заявки</WidgetTitle>
                    <WidgetIcon color="#FF9800">
                        <Assignment />
                    </WidgetIcon>
                </WidgetHeader>
                <Box>
                    <WidgetValue>
                        {openRequestsCount}
                    </WidgetValue>
                    <Typography variant="caption" color="text.secondary">
                        Открытых заявок
                    </Typography>
                </Box>
            </WidgetCard>
        </WidgetsGrid>
    );
};

export default StatsWidgets;
