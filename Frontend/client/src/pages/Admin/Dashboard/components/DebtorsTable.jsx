import React, { useMemo, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Box,
  Button,
  TableSortLabel
} from '@mui/material';
import { Sort as SortIcon } from '@mui/icons-material';
import { SectionContainer, StyledTableCell, RankCircle } from '../Dashboard.styles';

const DebtorsTable = ({ debtors, loading }) => {
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  const formatCurrency = (val) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(val);

  const sortedDebtors = useMemo(() => {
    const list = Array.isArray(debtors) ? [...debtors] : [];
    list.sort((a, b) => {
      const av = a?.debtAmount ?? 0;
      const bv = b?.debtAmount ?? 0;
      return sortOrder === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [debtors, sortOrder]);

  const toggleSort = () => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'));

  return (
    <SectionContainer elevation={0}>
      {/* Шапка с кнопками сортировки справа */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Топ-10 Должников
        </Typography>

        {!loading && (
            <Button
                size="small"
                variant="outlined"
                startIcon={<SortIcon sx={{ transform: sortOrder === 'asc' ? 'scaleY(-1)' : 'none' }} />}
                onClick={toggleSort}
                sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
                {sortOrder === 'desc' ? 'По убыванию долга' : 'По возрастанию долга'}
            </Button>
        )}
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell width={50}>#</StyledTableCell>
              <StyledTableCell>Лицевой счет</StyledTableCell>
              <StyledTableCell>Адрес</StyledTableCell>
              <StyledTableCell>Собственник</StyledTableCell>
              <StyledTableCell align="right">Долг</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <StyledTableCell><Skeleton variant="circular" width={24} height={24} /></StyledTableCell>
                  <StyledTableCell><Skeleton width="80%" /></StyledTableCell>
                  <StyledTableCell><Skeleton width="60%" /></StyledTableCell>
                  <StyledTableCell><Skeleton width="50%" /></StyledTableCell>
                  <StyledTableCell align="right"><Skeleton width={80} /></StyledTableCell>
                </TableRow>
              ))
            ) : sortedDebtors.length > 0 ? (
              sortedDebtors.map((debtor, index) => (
                <TableRow key={`${debtor.accountNumber}-${debtor.address}`} hover>
                  <StyledTableCell>
                    <RankCircle index={index}>{index + 1}</RankCircle>
                  </StyledTableCell>
                  <StyledTableCell fontWeight="bold" sx={{ color: 'primary.main' }}>
                    {debtor.accountNumber}
                  </StyledTableCell>
                  <StyledTableCell>{debtor.address}</StyledTableCell>
                  <StyledTableCell>{debtor.ownerName || '—'}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Chip
                      label={formatCurrency(debtor.debtAmount)}
                      color="error"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 'bold', minWidth: 100 }}
                    />
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Задолженностей не найдено
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </SectionContainer>
  );
};

export default DebtorsTable;