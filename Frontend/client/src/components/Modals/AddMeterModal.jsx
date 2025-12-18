import { useState } from 'react';
import { MenuItem, IconButton } from '@mui/material';
import { adminService } from '../../api';
import { GlassInput } from '../common';
import {
    StyledAlert,
    Form,
    FormField,
    FieldLabel,
    SubmitButton,
} from './Auth.styles';
import { StyledDialog, ModalLoginCard } from './Modal.styles';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloseIcon from '@mui/icons-material/Close';
import { GlassDialogTitle } from '../common';
import {
    ModalHeader,
    ModalIconWrapper,
    ModalSubtitle,
    ModalCloseButton
} from '../../pages/Admin/Announcements/AdminAnnouncements.styles';
import { menuPaperStyles } from '../common/GlassSelect.styles';

const METER_TYPES = [
    { value: 0, label: 'Холодная вода' },
    { value: 1, label: 'Горячая вода' },
    { value: 2, label: 'Электричество' },
    { value: 3, label: 'Газ' },
];

const AddMeterModal = ({ open, onClose, onSuccess }) => {
    const [accountNumber, setAccountNumber] = useState(''); 
    const [type, setType] = useState(0);
    const [serialNumber, setSerialNumber] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await adminService.addMeter(accountNumber, type, serialNumber);
            
            setSerialNumber('');
            setAccountNumber('');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || 'Не удалось добавить счетчик';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StyledDialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            scroll="body"
        >
            <ModalLoginCard elevation={3}>
                <ModalHeader>
                    <ModalCloseButton>
                        <IconButton aria-label="close" onClick={onClose} size="large">
                            <CloseIcon />
                        </IconButton>
                    </ModalCloseButton>
                    <ModalIconWrapper>
                        <OpacityIcon color="primary" />
                    </ModalIconWrapper>
                    <GlassDialogTitle>Установка счетчика</GlassDialogTitle>
                    <ModalSubtitle>Привяжите прибор учета к лицевому счету</ModalSubtitle>
                </ModalHeader>

                {error && (
                    <StyledAlert severity='error'>
                        {error}
                    </StyledAlert>
                )}
                
                <Form onSubmit={handleSubmit}>
                    <FormField sx={{ mb: 1.5 }}>
                        <GlassInput
                            label="Номер лицевого счета"
                            fullWidth
                            type="text"
                            placeholder='Например: 100200300'
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            helperText="Введите номер счета, к которому относится счетчик"
                            required
                        />
                    </FormField>

                    <FormField>
                        <GlassInput
                            label="Тип счетчика"
                            select
                            fullWidth
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            SelectProps={{
                                MenuProps: { PaperProps: { sx: menuPaperStyles } }
                            }}
                        >
                            {METER_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </GlassInput>
                    </FormField>

                    <FormField>
                        <GlassInput
                            label="Серийный номер"
                            fullWidth
                            placeholder='Например: SN-123456'
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            required
                        />
                    </FormField>

                    <SubmitButton
                        type='submit'
                        fullWidth
                        variant='contained'
                        size='large'
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Добавить счетчик'}
                    </SubmitButton>
                </Form>
            </ModalLoginCard>
        </StyledDialog>
    );
};

export default AddMeterModal;