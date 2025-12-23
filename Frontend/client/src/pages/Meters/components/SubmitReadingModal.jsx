import { useState, useEffect } from 'react';
import { 
    Typography, IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import dayjs from 'dayjs';
import { 
    FormContainer, 
    ModalTitleBox, 
    ModalContentBox, 
    StyledAlert, 
    LastReadingBox
} from '../Meters.styles';
import { metersService } from '../../../api/meters';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton, GlassInput, GlassSelect } from '../../../components/common';
import { ERROR_MESSAGES, VALIDATION_MESSAGES } from '../../../utils/constants';

const SubmitReadingModal = ({ open, onClose, meters, initialMeterId, onSuccess, readings }) => {
    const [selectedMeterId, setSelectedMeterId] = useState('');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedMeterId(initialMeterId || (meters.length > 0 ? meters[0].meterId : ''));
            setValue('');
            setError('');
        }
    }, [open, initialMeterId, meters]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedMeterId) {
            setError(VALIDATION_MESSAGES.SELECT_METER);
            return;
        }

        if (!value) {
            setError(VALIDATION_MESSAGES.ENTER_VALUE);
            return;
        }

        const currentMeter = meters.find(m => m.meterId === selectedMeterId);
        const lastReading = readings[selectedMeterId];
        const newValue = parseFloat(value);

        if (lastReading) {
            const prevValue = parseFloat(lastReading.value);
            if (!isNaN(prevValue) && newValue < prevValue && dayjs().isAfter(dayjs(lastReading.period))) {
                setError(`${VALIDATION_MESSAGES.READING_LESS_THAN_PREVIOUS} (${prevValue})`);
                return;
            }
        }

        setSubmitting(true);
        try {
            await metersService.submitReading(selectedMeterId, { 
                value: newValue,
                date: new Date().toISOString()
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || ERROR_MESSAGES.SUBMIT_READING_FAILED);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedMeter = meters.find(m => m.meterId === selectedMeterId);
    const lastReading = selectedMeterId ? readings[selectedMeterId] : null;

    return (
        <GlassDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <GlassDialogTitle>
                <ModalTitleBox>
                    <Typography variant="h5" fontWeight="bold">
                        Подать показания
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </ModalTitleBox>
            </GlassDialogTitle>

            <ModalContentBox>
                {error && <StyledAlert severity="error">{error}</StyledAlert>}

                <form onSubmit={handleSubmit} id="submit-reading-form">
                    <FormContainer>
                        <GlassSelect
                            label="Счетчик"
                            value={selectedMeterId}
                            onChange={(e) => setSelectedMeterId(e.target.value)}
                            fullWidth
                            options={meters.map((meter) => ({
                                value: meter.meterId,
                                label: `${meter.serialNumber} (${meter.type === 0 ? 'ХВ' : meter.type === 1 ? 'ГВ' : meter.type === 2 ? 'Эл' : 'Газ'})`
                            }))}
                        />

                        {lastReading && (
                            <LastReadingBox>
                                <Typography variant="body2" color="textSecondary">
                                    Предыдущее показание:
                                </Typography>
                                <Typography variant="h6" color="primary.main" fontWeight="bold">
                                    {lastReading.value}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    от {new Date(lastReading.period).toLocaleDateString()}
                                </Typography>
                            </LastReadingBox>
                        )}

                        <GlassInput
                            label="Новое показание"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            fullWidth
                            slotProps={{ htmlInput: { step: "0.01" } }}
                            required
                            placeholder="0.00"
                        />
                    </FormContainer>
                </form>
            </ModalContentBox>

            <GlassDialogActions>
                <GlassButton onClick={onClose} color="inherit">
                    Отмена
                </GlassButton>
                <GlassButton 
                    type="submit" 
                    form="submit-reading-form"
                    variant="contained" 
                    disabled={submitting}
                >
                    {submitting ? 'Отправка...' : 'Подать'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default SubmitReadingModal;
