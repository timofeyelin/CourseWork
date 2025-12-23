import { useState } from 'react';
import { Stack, IconButton } from '@mui/material';
import { adminService } from '../../api';
import { GlassInput, GlassDialogTitle } from '../common';
import {
    StyledAlert,
    Form,
    FormField,
    FieldLabel,
    SubmitButton,
} from './Auth.styles';
import { StyledDialog, ModalLoginCard } from './Modal.styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloseIcon from '@mui/icons-material/Close';
import {
    ModalHeader,
    ModalIconWrapper,
    ModalSubtitle,
    ModalCloseButton
} from '../../pages/Operator/Announcements/OperatorAnnouncements.styles';

const CreateAccountModal = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        accountNumber: '',
        address: '',
        area: '',
        occupantsCount: 1,
        houseType: 'Многоквартирный',
        ukName: 'ООО УК Горизонт'
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await adminService.createAccount({
                ...formData,
                area: Number(formData.area),
                occupantsCount: Number(formData.occupantsCount)
            });
            
            // Сброс формы и закрытие
            setFormData({ 
                accountNumber: '', 
                address: '', 
                area: '', 
                occupantsCount: 1, 
                houseType: 'Многоквартирный', 
                ukName: 'ООО УК Горизонт' 
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Не удалось создать лицевой счет';
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
                        <AccountBalanceIcon color="primary" />
                    </ModalIconWrapper>
                    <GlassDialogTitle>Новый лицевой счет</GlassDialogTitle>
                    <ModalSubtitle>Заполните данные квартиры или дома</ModalSubtitle>
                </ModalHeader>

                {error && (
                    <StyledAlert severity='error'>
                        {error}
                    </StyledAlert>
                )}
                
                <Form onSubmit={handleSubmit}>
                    <FormField>
                        <GlassInput
                            label="Номер счета (ЛС)"
                            fullWidth
                            name='accountNumber'
                            placeholder='Например: 100200300'
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                        />
                    </FormField>

                    <FormField>
                        <GlassInput
                            label="Адрес"
                            fullWidth
                            name='address'
                            placeholder='Улица, дом, квартира'
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </FormField>

                    <Stack direction="row" spacing={2}>
                        <FormField>
                            <GlassInput
                                label="Площадь (м²)"
                                fullWidth
                                name='area'
                                type="number"
                                placeholder='0.0'
                                value={formData.area}
                                onChange={handleChange}
                                required
                                slotProps={{ htmlInput: { step: '0.01' } }}
                            />
                        </FormField>
                        <FormField>
                            <GlassInput
                                label="Жильцов"
                                fullWidth
                                name='occupantsCount'
                                type="number"
                                placeholder='1'
                                value={formData.occupantsCount}
                                onChange={handleChange}
                                required
                            />
                        </FormField>
                    </Stack>

                    <FormField>
                        <GlassInput
                            label="Управляющая компания"
                            fullWidth
                            name='ukName'
                            value={formData.ukName}
                            onChange={handleChange}
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
                        {isSubmitting ? 'Создание...' : 'Создать счет'}
                    </SubmitButton>
                </Form>
            </ModalLoginCard>
        </StyledDialog>
    );
};

export default CreateAccountModal;