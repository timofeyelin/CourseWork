import React, { useState, useEffect, useCallback } from 'react';
import { 
    Typography, CircularProgress, Box, 
    Table, TableBody, TableHead,
    Pagination, Chip, InputAdornment, Paper
} from '@mui/material';
import { HistoryEdu as AuditIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { adminService } from '../../../api';
import { AppSnackbar, GlassInput, GlassDatePicker, GlassButton } from '../../../components/common';
import { 
    PageContainer, 
    PageCard,
    HeaderSection, 
    TitleContainer,
    PageTitle,
    PageSubtitle,
    FilterSection,
    ContentSection,
    StyledTableContainer,
    StyledTableHeadCell,
    StyledTableRow,
    StyledTableCell,
    PaginationSection
} from './AdminAudit.styles';

const AdminAudit = () => {
    const [logs, setLogs] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 20;

    // Фильтры
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const fromDateStr = fromDate ? fromDate.toISOString().split('T')[0] : null;
            const toDateStr = toDate ? toDate.toISOString().split('T')[0] : null;
            
            const response = await adminService.getAuditLogs(
                page, 
                pageSize, 
                fromDateStr, 
                toDateStr, 
                search || null
            );
            setLogs(response.data.data);
            setTotalCount(response.data.totalCount);
        } catch (err) {
            console.error(err);
            setError('Не удалось загрузить журнал аудита');
        } finally {
            setLoading(false);
        }
    }, [page, fromDate, toDate, search]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Debounce для поиска
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                setSearch(searchInput);
                setPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleFromDateChange = (newValue) => {
        setFromDate(newValue);
        setPage(1);
    };

    const handleToDateChange = (newValue) => {
        setToDate(newValue);
        setPage(1);
    };

    const handleClearFilters = () => {
        setFromDate(null);
        setToDate(null);
        setSearch('');
        setSearchInput('');
        setPage(1);
    };

    const hasFilters = fromDate || toDate || search;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('ru-RU');
    };

    const getActionColor = (actionType) => {
        if (actionType.includes('Delete') || actionType.includes('Block')) return 'error';
        if (actionType.includes('Create') || actionType.includes('Register')) return 'success';
        if (actionType.includes('Update') || actionType.includes('Change')) return 'warning';
        return 'primary';
    };

    return (
        <PageContainer>
            <PageCard>
                <HeaderSection>
                    <TitleContainer>
                        <PageTitle>
                            <AuditIcon />
                            Журнал аудита
                        </PageTitle>
                        <PageSubtitle>
                            История действий в системе
                        </PageSubtitle>
                    </TitleContainer>
                </HeaderSection>

                <FilterSection>
                    <GlassDatePicker
                        label="С даты"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        slotProps={{ 
                            textField: { 
                                size: 'small',
                                sx: { minWidth: 160 }
                            } 
                        }}
                    />
                    <GlassDatePicker
                        label="По дату"
                        value={toDate}
                        onChange={handleToDateChange}
                        slotProps={{ 
                            textField: { 
                                size: 'small',
                                sx: { minWidth: 160 }
                            } 
                        }}
                    />
                    <GlassInput
                        placeholder="Поиск по действию, сущности, деталям..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        size="small"
                        sx={{ minWidth: 300, flexGrow: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            )
                        }}
                    />
                    {hasFilters && (
                        <GlassButton 
                            variant="outlined" 
                            size="small" 
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                        >
                            Сбросить
                        </GlassButton>
                    )}
                </FilterSection>

                <ContentSection>
                    <StyledTableContainer component={Paper}>
                        <Table stickyHeader>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableHeadCell>Время</StyledTableHeadCell>
                                    <StyledTableHeadCell>Действие</StyledTableHeadCell>
                                    <StyledTableHeadCell>Сущность</StyledTableHeadCell>
                                    <StyledTableHeadCell>User ID</StyledTableHeadCell>
                                    <StyledTableHeadCell>Детали</StyledTableHeadCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <CircularProgress />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <StyledTableRow key={log.auditLogId} hover>
                                            <StyledTableCell sx={{ whiteSpace: 'nowrap' }}>
                                                {formatDate(log.timestamp)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Chip 
                                                    label={log.actionType} 
                                                    size="small" 
                                                    color={getActionColor(log.actionType)}
                                                    variant="outlined" 
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {log.entityName} 
                                                <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }}>
                                                    (ID: {log.entityId})
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>{log.userId || 'System'}</StyledTableCell>
                                            <StyledTableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {log.details}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ) : (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <Typography color="textSecondary">
                                                {hasFilters ? 'Записей по заданным фильтрам не найдено' : 'Записей нет'}
                                            </Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                </ContentSection>

                <PaginationSection>
                    <Pagination 
                        count={Math.ceil(totalCount / pageSize)} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                        disabled={loading}
                    />
                    <Typography variant="body2" color="textSecondary">
                        Всего записей: {totalCount}
                    </Typography>
                </PaginationSection>
            </PageCard>

            <AppSnackbar 
                open={!!error} 
                message={error} 
                severity="error" 
                onClose={() => setError(null)} 
            />
        </PageContainer>
    );
};

export default AdminAudit;