import { 
    Table, TableBody, TableHead, 
    Tooltip, Typography, Box 
} from '@mui/material';
import { History, AddCircleOutline } from '@mui/icons-material';
import { 
    StyledTableContainer, 
    StyledTableHeadCell, 
    StyledTableRow, 
    StyledTableCell,
    StyledChip,
    ActionIconButton,
    NoDataTypography,
    ActionsBox
} from '../Meters.styles';

const MetersTable = ({ meters, readings, onOpenHistory, onOpenSubmit }) => {
    
    const getMeterTypeLabel = (type) => {
        switch (type) {
            case 0: return 'Холодная вода';
            case 1: return 'Горячая вода';
            case 2: return 'Электричество';
            case 3: return 'Газ';
            default: return 'Счетчик';
        }
    };

    const getMeterTypeColor = (type) => {
        switch (type) {
            case 0: return 'info';
            case 1: return 'error';
            case 2: return 'warning';
            case 3: return 'success';
            default: return 'default';
        }
    };

    return (
        <StyledTableContainer>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableHeadCell>Тип</StyledTableHeadCell>
                        <StyledTableHeadCell>Серийный номер</StyledTableHeadCell>
                        <StyledTableHeadCell>Лицевой счет</StyledTableHeadCell>
                        <StyledTableHeadCell>Дата установки</StyledTableHeadCell>
                        <StyledTableHeadCell>Последнее показание</StyledTableHeadCell>
                        <StyledTableHeadCell>Действия</StyledTableHeadCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {meters.map((meter) => {
                        const lastReading = readings[meter.meterId];
                        return (
                            <StyledTableRow key={meter.meterId}>
                                <StyledTableCell>
                                    <StyledChip 
                                        label={getMeterTypeLabel(meter.type)} 
                                        color={getMeterTypeColor(meter.type)} 
                                        size="small" 
                                        variant="filled"
                                    />
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Typography variant="body2" fontWeight="600">
                                        {meter.serialNumber}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell>{meter.accountNumber}</StyledTableCell>
                                <StyledTableCell>
                                    {new Date(meter.installationDate).toLocaleDateString()}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {lastReading ? (
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                {lastReading.value}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {new Date(lastReading.period).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="caption" color="textSecondary">Нет данных</Typography>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <ActionsBox>
                                        <Tooltip title="История показаний">
                                            <ActionIconButton 
                                                onClick={() => onOpenHistory(meter)} 
                                                color="primary"
                                                bgcolor="primary.light"
                                                hovercolor="primary.main"
                                            >
                                                <History fontSize="small" />
                                            </ActionIconButton>
                                        </Tooltip>
                                        <Tooltip title="Подать показание">
                                            <ActionIconButton 
                                                onClick={() => onOpenSubmit(meter)} 
                                                color="secondary"
                                                bgcolor="secondary.light"
                                                hovercolor="secondary.main"
                                            >
                                                <AddCircleOutline fontSize="small" />
                                            </ActionIconButton>
                                        </Tooltip>
                                    </ActionsBox>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                    {meters.length === 0 && (
                        <StyledTableRow>
                            <StyledTableCell colSpan={6} align="center">
                                <NoDataTypography variant="body1">
                                    Приборы учета не найдены
                                </NoDataTypography>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );
};

export default MetersTable;
