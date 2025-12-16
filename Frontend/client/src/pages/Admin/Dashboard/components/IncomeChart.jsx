import React from 'react';
import { Typography, Box, Skeleton } from '@mui/material';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { SectionContainer } from '../Dashboard.styles';

const IncomeChart = ({ data, loading, periodLabel }) => {
    const formatCurrency = (val) => new Intl.NumberFormat('ru-RU', { 
        style: 'currency', currency: 'RUB', maximumFractionDigits: 0 
    }).format(val);
    
    const yAxisFormatter = (value) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            notation: 'compact', // Будет писать 10 тыс. ₽ вместо 10 000 ₽ (чтобы влезало)
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <SectionContainer elevation={0}>
            <Typography variant="h6" fontWeight="bold">
                Поступления за период{periodLabel ? ` (${periodLabel})` : ''}
            </Typography>
            
            {/* ФИКС: width="100%" и minHeight для контейнера */}
            <Box height={350} width="100%" mt={2} sx={{ minHeight: 350 }}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '12px' }} />
                ) : (
                    // ФИКС: Рендерим график только если есть данные (хотя бы пустой массив), 
                    // иначе Recharts может сходить с ума
                    data && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0288D1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#0288D1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#90A4AE" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#90A4AE" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={yAxisFormatter}
                                    width={80}
                                />
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), 'Сумма']}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255,255,255,0.9)', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#0288D1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorAmount)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )
                )}
            </Box>
        </SectionContainer>
    );
};

export default IncomeChart;