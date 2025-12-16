import { Typography, Box, Skeleton } from '@mui/material';
import { 
    AttachMoney, 
    MoneyOff, 
    AccountBalanceWallet, 
    PieChart 
} from '@mui/icons-material';
import { KpiGrid, KpiCardItem, KpiIconWrapper } from '../Dashboard.styles';

const KpiCards = ({ kpi, loading }) => {
    const formatCurrency = (val) => new Intl.NumberFormat('ru-RU', { 
        style: 'currency', currency: 'RUB', maximumFractionDigits: 0 
    }).format(val);

    const items = [
        { 
            title: 'Начислено', 
            value: kpi?.totalCharged, 
            format: formatCurrency, 
            icon: <AccountBalanceWallet />, 
            color: '#0288D1' // Primary
        },
        { 
            title: 'Собрано', 
            value: kpi?.totalCollected, 
            format: formatCurrency, 
            icon: <AttachMoney />, 
            color: '#2E7D32' // Success
        },
        { 
            title: 'Задолженность', 
            value: kpi?.totalDebt, 
            format: formatCurrency, 
            icon: <MoneyOff />, 
            color: '#D32F2F' // Error
        },
        { 
            title: '% Сбора', 
            value: kpi?.collectionRate, 
            format: (v) => `${v}%`, 
            icon: <PieChart />, 
            color: '#ED6C02' // Warning
        },
    ];

    return (
        <KpiGrid>
            {items.map((item, index) => (
                <KpiCardItem key={index} elevation={0}>
                    {loading ? (
                        <>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="circular" width={32} height={32} />
                            </Box>
                            <Skeleton variant="rectangular" height={36} width="80%" />
                        </>
                    ) : (
                        <>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                    {item.title}
                                </Typography>
                                <KpiIconWrapper color={item.color}>
                                    {item.icon}
                                </KpiIconWrapper>
                            </Box>
                            <Typography variant="h4" fontWeight="700" color={item.color} sx={{ mt: 1 }}>
                                {item.format(item.value)}
                            </Typography>
                        </>
                    )}
                </KpiCardItem>
            ))}
        </KpiGrid>
    );
};

export default KpiCards;