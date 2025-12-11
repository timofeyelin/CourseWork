import { Box, Typography } from '@mui/material';
import { AccountBalanceWallet, Assignment } from '@mui/icons-material';
import { 
    WidgetsGrid, 
    WidgetCard, 
    WidgetHeader, 
    WidgetTitle, 
    WidgetValue, 
    WidgetIcon 
} from '../Home.styles';

const StatsWidgets = ({ balance, openRequestsCount }) => {
    return (
        <WidgetsGrid>
            <WidgetCard color="#0288D1">
                <WidgetHeader>
                    <WidgetTitle>Баланс</WidgetTitle>
                    <WidgetIcon color="#0288D1">
                        <AccountBalanceWallet />
                    </WidgetIcon>
                </WidgetHeader>
                <Box>
                    <WidgetValue color={balance > 0 ? "#d32f2f" : "#2e7d32"}>
                        {balance.toLocaleString('ru-RU')} ₽
                    </WidgetValue>
                    <Typography variant="caption" color="text.secondary">
                        {balance > 0 ? 'Задолженность' : 'Все оплачено'}
                    </Typography>
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
