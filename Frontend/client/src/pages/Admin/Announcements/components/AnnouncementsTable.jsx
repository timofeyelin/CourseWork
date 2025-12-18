import { 
    Table,
    TableHead, 
    TableBody, 
    TableRow,
    Chip,
    Tooltip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { GlassIconButton } from '../../../../components/common';
import {
    StyledTableContainer,
    StyledTableRow,
    StyledTableCell,
    StyledTableHeadCell
} from '../AdminAnnouncements.styles';

const AnnouncementsTable = ({ announcements, onDeleteClick, onEditClick }) => {
    return (
        <StyledTableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableHeadCell>Заголовок</StyledTableHeadCell>
                        <StyledTableHeadCell>Дата создания</StyledTableHeadCell>
                        <StyledTableHeadCell>Срочность</StyledTableHeadCell>
                        <StyledTableHeadCell align="right">Действия</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {announcements.map((announcement) => (
                        <StyledTableRow key={announcement.announcementId} hover>
                            <StyledTableCell>{announcement.title}</StyledTableCell>
                            <StyledTableCell>
                                {new Date(announcement.createdAt).toLocaleDateString('ru-RU')}
                            </StyledTableCell>
                            <StyledTableCell>
                                {announcement.isEmergency && (
                                    <Chip 
                                        label="Срочно" 
                                        color="error" 
                                        size="small" 
                                        variant="outlined"
                                    />
                                )}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Tooltip title="Редактировать">
                                    <GlassIconButton
                                        onClick={() => onEditClick && onEditClick(announcement)}
                                        size="small"
                                    >
                                        {/* use built-in edit icon */}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
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
