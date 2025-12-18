import { 
    Table,
    TableHead, 
    TableBody, 
    TableRow,
    Chip,
    Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'; // Добавил EditIcon для красоты
import { GlassIconButton } from '../../../../components/common';
import {
    StyledTableContainer,
    StyledTableRow,
    StyledTableCell,
    StyledTableHeadCell
} from '../AdminAnnouncements.styles';
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_TYPE_LABELS } from '../../../../utils/constants'; // <-- Импорт констант

const AnnouncementsTable = ({ announcements, onDeleteClick, onEditClick }) => {
    
    // Вспомогательная функция для определения цвета и текста чипа
    const getTypeChip = (type) => {
        switch (type) {
            case ANNOUNCEMENT_TYPES.EMERGENCY:
                return (
                    <Chip 
                        label={ANNOUNCEMENT_TYPE_LABELS[ANNOUNCEMENT_TYPES.EMERGENCY]} 
                        color="error" 
                        size="small" 
                        variant="filled" // Для аварий можно сделать заливку, чтобы бросалось в глаза
                    />
                );
            case ANNOUNCEMENT_TYPES.OUTAGE:
                return (
                    <Chip 
                        label={ANNOUNCEMENT_TYPE_LABELS[ANNOUNCEMENT_TYPES.OUTAGE]} 
                        color="warning" 
                        size="small" 
                        variant="outlined"
                    />
                );
            default: // INFO
                return (
                    <Chip 
                        label={ANNOUNCEMENT_TYPE_LABELS[ANNOUNCEMENT_TYPES.INFO] || 'Инфо'} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                    />
                );
        }
    };

    return (
        <StyledTableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableHeadCell>Заголовок</StyledTableHeadCell>
                        <StyledTableHeadCell>Дата создания</StyledTableHeadCell>
                        <StyledTableHeadCell>Тип</StyledTableHeadCell> {/* БЫЛО: Срочность */}
                        <StyledTableHeadCell align="right">Действия</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {announcements.map((announcement) => (
                        <StyledTableRow key={announcement.announcementId} hover>
                            <StyledTableCell>{announcement.title}</StyledTableCell>
                            <StyledTableCell>
                                {new Date(announcement.createdAt).toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </StyledTableCell>
                            <StyledTableCell>
                                {/* Вывод чипа в зависимости от типа */}
                                {getTypeChip(announcement.type)}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Tooltip title="Редактировать">
                                    <GlassIconButton
                                        onClick={() => onEditClick && onEditClick(announcement)}
                                        size="small"
                                    >
                                        <EditIcon fontSize="small" />
                                    </GlassIconButton>
                                </Tooltip>
                                <Tooltip title="Удалить">
                                    <GlassIconButton 
                                        color="error" 
                                        onClick={() => onDeleteClick(announcement)}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </GlassIconButton>
                                </Tooltip>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    {announcements.length === 0 && (
                        <TableRow>
                            <StyledTableCell colSpan={4} align="center">
                                Нет объявлений
                            </StyledTableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );
};

export default AnnouncementsTable;