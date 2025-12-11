import { useEffect, useState } from 'react';
import { 
    Typography, IconButton, 
    Table, TableBody, TableCell, TableHead, TableRow, CircularProgress 
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { 
    HistoryTableContainer, 
    HistoryValueCell, 
    StatusBox,
    ModalTitleBox,
    ModalContentBox,
    LoadingBox
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

            <ModalContentBox>
                {loading ? (
                    <LoadingBox>
                        <CircularProgress />
                    </LoadingBox>
                ) : (
                    <HistoryTableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Дата</TableCell>
                                    <TableCell align="right">Значение</TableCell>
                                    <TableCell align="center">Статус</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((reading) => (
                                    <TableRow key={reading.readingId} hover>
                                        <TableCell>
                                            {new Date(reading.period).toLocaleDateString()}
                                        </TableCell>
                                        <HistoryValueCell align="right">
                                            {reading.value}
                                        </HistoryValueCell>
                                        <TableCell align="center">
                                            {reading.validated ? (
                                                <StatusBox component="span" status="validated">
                                                    Подтверждено
                                                </StatusBox>
                                            ) : (
                                                <StatusBox component="span" status="pending">
                                                    На проверке
                                                </StatusBox>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {history.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            Нет истории показаний
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </HistoryTableContainer>
                )}
            </ModalContentBox>
            
            <GlassDialogActions>
                <GlassButton onClick={onClose}>Закрыть</GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default MeterHistoryModal;
