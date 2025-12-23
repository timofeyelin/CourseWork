import React, { useMemo, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableHead,
  Chip,
  Skeleton,
  Box,
  Button,
} from '@mui/material';
import { Sort as SortIcon } from '@mui/icons-material';
import { 
  SectionContainer, 
  StyledTableContainer,
  StyledTableHeadCell,
  StyledTableRow,
  StyledTableCell, 
  RankCircle 
} from '../Dashboard.styles';

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

      <StyledTableContainer sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableHeadCell width={50}>#</StyledTableHeadCell>
              <StyledTableHeadCell>Лицевой счет</StyledTableHeadCell>
              <StyledTableHeadCell>Адрес</StyledTableHeadCell>
              <StyledTableHeadCell>Собственник</StyledTableHeadCell>
              <StyledTableHeadCell align="right">Долг</StyledTableHeadCell>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell><Skeleton variant="circular" width={24} height={24} /></StyledTableCell>
                  <StyledTableCell><Skeleton width="80%" /></StyledTableCell>
                  <StyledTableCell><Skeleton width="60%" /></StyledTableCell>
                  <StyledTableCell><Skeleton width="50%" /></StyledTableCell>
                  <StyledTableCell align="right"><Skeleton width={80} /></StyledTableCell>
                </StyledTableRow>
              ))
            ) : sortedDebtors.length > 0 ? (
              sortedDebtors.map((debtor, index) => (
                <StyledTableRow key={`${debtor.accountNumber}-${debtor.address}`} hover>
                  <StyledTableCell>
                    <RankCircle index={index}>{index + 1}</RankCircle>
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Задолженностей не найдено
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </SectionContainer>
  );
};

export default DebtorsTable;