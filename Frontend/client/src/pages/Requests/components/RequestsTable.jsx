import { 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    Tooltip,
    Rating
} from '@mui/material';
import { 
    Visibility as ViewIcon
} from '@mui/icons-material';
import { 
    GlassIconButton, 
    StatusPill 
} from '../../../components/common';
import { 
    REQUEST_STATUSES, 
    REQUEST_STATUS_LABELS,
    REQUEST_CATEGORY_LABELS
} from '../../../utils/constants';
import {
    StyledTableContainer,
    StyledTableHeadCell,
    StyledTableRow,
    StyledTableCell
} from '../Requests.styles';

const RequestsTable = ({ requests = [], onViewDetails }) => {
    const safeRequests = Array.isArray(requests) ? requests : [];
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <StyledTableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableHeadCell>Дата создания</StyledTableHeadCell>
                        <StyledTableHeadCell>Категория</StyledTableHeadCell>
                        <StyledTableHeadCell>Описание</StyledTableHeadCell>
                        <StyledTableHeadCell>Статус</StyledTableHeadCell>
                        <StyledTableHeadCell>Оценка</StyledTableHeadCell>
                        <StyledTableHeadCell align="right">Действия</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {safeRequests.length === 0 ? (
                        <TableRow>
                            <StyledTableCell colSpan={6} align="center">
                                Заявок не найдено
                            </StyledTableCell>
                        </TableRow>
                    ) : (
                        safeRequests.map((req) => (
                            <StyledTableRow key={req.requestId} hover>
                                <StyledTableCell>{formatDate(req.createdAt)}</StyledTableCell>
                                <StyledTableCell>{REQUEST_CATEGORY_LABELS[req.category] || req.category}</StyledTableCell>
                                <StyledTableCell>
                                    <Tooltip title={req.description || req.Description || ''}>
                                        <span>
                                            {((req.description || req.Description || '')).length > 50 
                                                ? `${(req.description || req.Description || '').substring(0, 50)}...` 
                                                : (req.description || req.Description || '')}
                                        </span>
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StatusPill status={req.status === REQUEST_STATUSES.NEW ? 'new' : 
                                                      req.status === REQUEST_STATUSES.IN_PROGRESS ? 'pending' : 
                                                      req.status === REQUEST_STATUSES.CLOSED ? 'paid' : 'cancelled'}>
                                        {REQUEST_STATUS_LABELS[req.status]}
                                    </StatusPill>
                                </StyledTableCell>
                                <StyledTableCell>
                                    {req.rating ? (
                                        <Rating value={req.rating} readOnly size="small" />
                                    ) : '-'}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Tooltip title="Просмотр">
                                        <GlassIconButton 
                                            size="small" 
                                            onClick={() => onViewDetails(req)}
                                        >
                                            <ViewIcon fontSize="small" />
                                        </GlassIconButton>
                                    </Tooltip>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );
};

export default RequestsTable;
