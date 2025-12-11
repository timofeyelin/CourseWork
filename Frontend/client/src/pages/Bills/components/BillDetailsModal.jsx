import { 
    Paper, 
    Typography, 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    DialogContent 
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../../components/common';
import {
    ModalInfoSection,
    ModalInfoRow,
    BillDetailsTable,
    ModalTableCellHead,
    ModalTableCell,
    ModalTableRow,
    TotalAmount
} from '../Bills.styles';

const BillDetailsModal = ({ 
    open, 
    onClose, 
    bill, 
    onDownloadPdf, 
    onOpenPayment,
    formatDate,
    formatCurrency
}) => {
    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <GlassDialogTitle>
                Детали счета за {bill && formatDate(bill.period)}
            </GlassDialogTitle>
            <DialogContent>
                {bill && (
                    <>
                        <ModalInfoSection>
                            <ModalInfoRow>
                                <Typography variant="body2" color="textSecondary">Лицевой счет</Typography>
                                <Typography variant="body1" fontWeight="600">{bill.accountNumber}</Typography>
                            </ModalInfoRow>
                        </ModalInfoSection>
                        
                        <BillDetailsTable component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <ModalTableCellHead>Услуга</ModalTableCellHead>
                                        <ModalTableCellHead align="right">Тариф</ModalTableCellHead>
                                        <ModalTableCellHead align="right">Объем</ModalTableCellHead>
                                        <ModalTableCellHead align="right">Сумма</ModalTableCellHead>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bill.items && bill.items.map((item, index) => (
                                        <ModalTableRow key={index}>
                                            <ModalTableCell>{item.service}</ModalTableCell>
                                            <ModalTableCell align="right">{item.tariff}</ModalTableCell>
                                            <ModalTableCell align="right">{item.volume}</ModalTableCell>
                                            <ModalTableCell align="right">{formatCurrency(item.amount)}</ModalTableCell>
                                        </ModalTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </BillDetailsTable>
                        
                        <TotalAmount>
                            <Typography variant="body1" color="textSecondary">Итого к оплате</Typography>
                            <Typography variant="h5" color="primary" fontWeight="700">
                                {formatCurrency(bill.amount)}
                            </Typography>
                        </TotalAmount>
                    </>
                )}
            </DialogContent>
            <GlassDialogActions>
                <GlassButton 
                    onClick={() => onDownloadPdf(bill.id)}
                    startIcon={<DownloadIcon />}
                    variant="text"
                >
                    Скачать квитанцию
                </GlassButton>
                <GlassButton onClick={onClose} variant="text">
                    Закрыть
                </GlassButton>
                {bill && !bill.isPaid && (
                    <GlassButton 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                            onClose();
                            onOpenPayment(bill);
                        }}
                    >
                        Оплатить
                    </GlassButton>
                )}
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default BillDetailsModal;
