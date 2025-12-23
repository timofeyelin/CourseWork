import { useEffect, useState } from 'react';
import { Typography, IconButton, Table, TableBody, TableHead, CircularProgress, DialogContent } from '@mui/material';
import { Close } from '@mui/icons-material';
import { 
    HistoryTableContainer, 
    HistoryValueCell, 
    ModalTitleBox,
    ModalContentBox,
    LoadingBox,
    StyledTableHeadCell,
    StyledTableRow,
    StyledTableCell
} from '../Meters.styles';
import { metersService } from '../../../api/meters';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../../components/common';

const MeterHistoryModal = ({ open, onClose, meter }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && meter) {
            loadHistory();
        }
    }, [open, meter]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await metersService.getHistory(meter.meterId);
            const sorted = data.sort((a, b) => new Date(b.period) - new Date(a.period));
            setHistory(sorted);
        } catch (error) {
            console.error('Failed to load history', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <GlassDialogTitle>
                <ModalTitleBox>
                    <Typography variant="h5" fontWeight="bold">
                        История показаний
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </ModalTitleBox>
                <Typography variant="subtitle1" color="textSecondary">
                    Счетчик № {meter?.serialNumber}
                </Typography>
            </GlassDialogTitle>

            <DialogContent>
                <ModalContentBox>
                    {loading ? (
                        <LoadingBox>
                            <CircularProgress />
                        </LoadingBox>
                    ) : (
                        <HistoryTableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableHeadCell>Дата</StyledTableHeadCell>
                                        <StyledTableHeadCell align="center">Значение</StyledTableHeadCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((reading) => (
                                        <StyledTableRow key={reading.readingId} hover>
                                            <StyledTableCell>
                                                {new Date(reading.period).toLocaleDateString()}
                                            </StyledTableCell>
                                            <HistoryValueCell align="center">
                                                {reading.value}
                                            </HistoryValueCell>
                                        </StyledTableRow>
                                    ))}
                                    {history.length === 0 && (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={2} align="center">
                                                Нет истории показаний
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </HistoryTableContainer>
                    )}
                </ModalContentBox>
            </DialogContent>
            
            <GlassDialogActions>
                <GlassButton onClick={onClose}>Закрыть</GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default MeterHistoryModal;
