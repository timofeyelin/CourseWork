import React, { useState } from 'react';
import { IconButton, Box, FormControlLabel, Switch } from '@mui/material';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { adminService } from '../../api';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton, GlassDatePicker } from '../common';
import {
    ModalHeader,
    ModalIconWrapper,
    ModalSubtitle,
    ModalCloseButton
} from '../../pages/Operator/Announcements/OperatorAnnouncements.styles';

const GenerateBillsModal = ({ open, onClose, onResult }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [force, setForce] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const period = selectedDate ? dayjs(selectedDate).format('YYYY-MM') : null;
            const resp = await adminService.generateBillsNow(period, force);
            if (onResult) onResult(null, resp.data);
            onClose();
        } catch (err) {
            if (onResult) onResult(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GlassDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <Box>
                <ModalHeader>
                    <ModalCloseButton>
                        <IconButton aria-label="close" onClick={onClose} size="large">
                            <CloseIcon />
                        </IconButton>
                    </ModalCloseButton>
                    <ModalIconWrapper>
                        <ReceiptLongIcon color="primary" />
                    </ModalIconWrapper>
                    <GlassDialogTitle>Сформировать квитанции</GlassDialogTitle>
                    <ModalSubtitle>Выберите период для формирования квитанций (месяц и год).</ModalSubtitle>
                </ModalHeader>

                <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <GlassDatePicker
                        label="Период"
                        value={selectedDate}
                        onChange={(d) => setSelectedDate(d)}
                        views={["year", "month"]}
                        format="MM.YYYY"
                        placeholder="MM.YYYY"
                    />

                    <FormControlLabel
                        control={<Switch checked={force} onChange={(e) => setForce(e.target.checked)} color="primary" />}
                        label="Включать непроверенные показания (force)"
                    />
                </Box>

                <GlassDialogActions>
                    <GlassButton variant="text" onClick={onClose}>Отмена</GlassButton>
                    <GlassButton variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Формирование...' : 'Сформировать'}
                    </GlassButton>
                </GlassDialogActions>
            </Box>
        </GlassDialog>
    );
};

export default GenerateBillsModal;
