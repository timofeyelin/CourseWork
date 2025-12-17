import { useState } from 'react';
import { Stack } from '@mui/material';
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
                <Header>
                    <Title variant='h5' component='h2' sx={{ mb: 1 }}>
                        Новый лицевой счет
                    </Title>
                    <Subtitle variant='body2'>
                        Заполните данные квартиры или дома
                    </Subtitle>
                </Header>

                {error && (
                    <StyledAlert severity='error'>
                        {error}
                    </StyledAlert>
                )}
                
                <Form onSubmit={handleSubmit}>
                    <FormField>
                        <FieldLabel variant='body2'>Номер счета (ЛС)</FieldLabel>
                        <GlassInput
                            fullWidth
                            name='accountNumber'
                            placeholder='Например: 100200300'
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                        />
                    </FormField>

                    <FormField>
                        <FieldLabel variant='body2'>Адрес</FieldLabel>
                        <GlassInput
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
                            <FieldLabel variant='body2'>Площадь (м²)</FieldLabel>
                            <GlassInput
                                fullWidth
                                name='area'
                                type="number"
                                placeholder='0.0'
                                value={formData.area}
                                onChange={handleChange}
                                required
                            />
                        </FormField>
                        <FormField>
                            <FieldLabel variant='body2'>Жильцов</FieldLabel>
                            <GlassInput
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
                        <FieldLabel variant='body2'>Управляющая компания</FieldLabel>
                        <GlassInput
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