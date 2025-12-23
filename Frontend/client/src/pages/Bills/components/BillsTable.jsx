import { 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    Tooltip 
} from '@mui/material';
import { 
    Visibility as ViewIcon, 
    Download as DownloadIcon, 
    Payment as PaymentIcon 
} from '@mui/icons-material';
import { GlassIconButton, StatusPill } from '../../../components/common';
import {
    StyledTableContainer,
    StyledTableHeadCell,
    StyledTableRow,
    StyledTableCell
} from '../Bills.styles';

const BillsTable = ({ 
    bills, 
    onViewDetails, 
    onDownloadPdf, 
    onOpenPayment,
    formatDate,
    formatCurrency
}) => {
    return (
        <StyledTableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableHeadCell>Период</StyledTableHeadCell>
                        <StyledTableHeadCell>Лицевой счет</StyledTableHeadCell>
                        <StyledTableHeadCell>Сумма</StyledTableHeadCell>
                        <StyledTableHeadCell>Статус</StyledTableHeadCell>
                        <StyledTableHeadCell align="right">Действия</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bills.length === 0 ? (
                        <TableRow>
                            <StyledTableCell colSpan={5} align="center">
                                Счетов не найдено
                            </StyledTableCell>
                        </TableRow>
                    ) : (
                        bills.map((bill) => (
                            <StyledTableRow key={bill.id} hover>
                                <StyledTableCell>{formatDate(bill.period)}</StyledTableCell>
                                <StyledTableCell>{bill.accountNumber}</StyledTableCell>
                                <StyledTableCell>{formatCurrency(bill.amount)}</StyledTableCell>
                                <StyledTableCell>
                                    <StatusPill status={bill.isPaid ? 'paid' : 'unpaid'}>
                                        {bill.isPaid ? 'Оплачено' : 'Не оплачено'}
                                    </StatusPill>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Tooltip title="Детали">
                                        <GlassIconButton 
                                            size="small" 
                                            onClick={() => onViewDetails(bill)}
                                        >
                                            <ViewIcon fontSize="small" />
                                        </GlassIconButton>
                                    </Tooltip>
                                    <Tooltip title="Скачать квитанцию">
                                        <GlassIconButton 
                                            size="small" 
                                            onClick={() => onDownloadPdf(bill.id)}
                                        >
                                            <DownloadIcon fontSize="small" />
                                        </GlassIconButton>
                                    </Tooltip>
                                    {!bill.isPaid && (
                                        <Tooltip title="Оплатить">
                                            <GlassIconButton 
                                                size="small" 
                                                onClick={() => onOpenPayment(bill)}
                                            >
                                                <PaymentIcon fontSize="small" />
                                            </GlassIconButton>
                                        </Tooltip>
                                    )}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );
};

export default BillsTable;
