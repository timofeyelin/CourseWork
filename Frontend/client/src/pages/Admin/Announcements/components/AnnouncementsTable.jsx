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

const AnnouncementsTable = ({ announcements, onDeleteClick }) => {
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
