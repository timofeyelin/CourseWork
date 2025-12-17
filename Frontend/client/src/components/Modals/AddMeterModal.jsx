import { useState } from 'react';
import { MenuItem } from '@mui/material';
import { adminService } from '../../api';
import { GlassInput } from '../common';
import {
    Header,
    Title,
    Subtitle,
    StyledAlert,
    Form,
    FormField,
    FieldLabel,
    SubmitButton,
} from './Auth.styles';
import { StyledDialog, ModalLoginCard } from './Modal.styles';

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
                <Header>
                    <Title variant='h5' component='h2' sx={{ mb: 1 }}>
                        Установка счетчика
                    </Title>
                    <Subtitle variant='body2'>
                        Привяжите прибор учета к лицевому счету
                    </Subtitle>
                </Header>

                {error && (
                    <StyledAlert severity='error'>
                        {error}
                    </StyledAlert>
                )}
                
                <Form onSubmit={handleSubmit}>
                    <FormField>
                        <FieldLabel variant='body2'>Номер лицевого счета</FieldLabel>
                        <GlassInput
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
                        <FieldLabel variant='body2'>Тип счетчика</FieldLabel>
                        <GlassInput
                            select
                            fullWidth
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {METER_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </GlassInput>
                    </FormField>

                    <FormField>
                        <FieldLabel variant='body2'>Серийный номер</FieldLabel>
                        <GlassInput
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