import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';
import { adminService } from '../../../api';
import { AppSnackbar, GlassDatePicker, GlassButton } from '../../../components/common';
import { ADMIN_MESSAGES } from '../../../utils/constants';
import {
    PageContainer,
    DashboardCard,
    HeaderSection,
    ScrollableContent
} from './Dashboard.styles';

import KpiCards from './components/KpiCards';
import IncomeChart from './components/IncomeChart';
import DebtorsTable from './components/DebtorsTable';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // null = показываем placeholder DD.MM.YYYY
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    const periodLabel = useMemo(() => {
        if (!from || !to) return 'последние 30 дней';
        return `${from.format('DD.MM.YYYY')} — ${to.format('DD.MM.YYYY')}`;
    }, [from, to]);

    const loadData = async (dateFrom, dateTo) => {
        setLoading(true);
        try {
            const query =
                dateFrom && dateTo
                    ? { from: dateFrom.format('YYYY-MM-DD'), to: dateTo.format('YYYY-MM-DD') }
                    : undefined; // без дат — дефолт на бэке

            const response = await adminService.getAnalytics(query);
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError(ADMIN_MESSAGES.ANALYTICS_LOAD_FAILED);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(null, null);
    }, []);

    const handleApplyPeriod = () => {
        if ((from && !to) || (!from && to)) {
            setError('Выберите обе даты: "С даты" и "По дату".');
            return;
        }
        if (from && to && from.isAfter(to)) {
            setError('Некорректный период: дата "С" не может быть позже даты "По".');
            return;
        }
        loadData(from, to);
    };

    const handleResetPeriod = () => {
        setFrom(null);
        setTo(null);
        loadData(null, null);
    };

    return (
        <PageContainer>
            <DashboardCard>
                <HeaderSection>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                        <AnalyticsIcon color="primary" fontSize="large" />
                        Финансовый мониторинг
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <GlassDatePicker
                            label="С даты"
                            value={from}
                            onChange={(newValue) => setFrom(newValue)}
                            sx={{ width: 170 }}
                            placeholder="DD.MM.YYYY"
                            format="DD.MM.YYYY"
                        />
                        <GlassDatePicker
                            label="По дату"
                            value={to}
                            onChange={(newValue) => setTo(newValue)}
                            sx={{ width: 170 }}
                            placeholder="DD.MM.YYYY"
                            format="DD.MM.YYYY"
                        />
                        <GlassButton
                            variant="contained"
                            onClick={handleApplyPeriod}
                            sx={{ height: 40 }}
                        >
                            Применить
                        </GlassButton>
                        <GlassButton
                            variant="outlined"
                            onClick={handleResetPeriod}
                            sx={{ height: 40 }}
                        >
                            Сбросить
                        </GlassButton>
                    </Box>
                </HeaderSection>

                <ScrollableContent>
                    <KpiCards kpi={data?.kpi} loading={loading} />

                    <IncomeChart data={data?.incomeChart ?? []} loading={loading} periodLabel={periodLabel} />

                    <DebtorsTable debtors={data?.topDebtors ?? []} loading={loading} />
                </ScrollableContent>
            </DashboardCard>

            <AppSnackbar
                open={!!error}
                message={error}
                severity="error"
                onClose={() => setError(null)}
            />
        </PageContainer>
    );
};

export default Dashboard;