import { useState, useEffect } from 'react';
import { DialogContent } from '@mui/material';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassInput, GlassButton } from '../../../components/common';
import { userService } from '../../../api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../utils/constants';
import { validateEmailForProfile, validatePhoneForProfile, validateProfilePassword } from '../../../utils/validationSchemas';

const ProfileEditModal = ({ open, onClose, initialProfile, onSaved, setSnackbar }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialProfile) {
            setEmail(initialProfile.email || '');
            setPhone(initialProfile.phone || '');
        }
    }, [initialProfile, open]);

    const validate = () => {
        try {
            validateEmailForProfile(email);
            if (phone && phone.trim() !== '') validatePhoneForProfile(phone);
            validateProfilePassword(password, confirmPassword);
            setErrors({});
            return true;
        } catch (err) {
            setErrors(err);
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const payload = {
                Email: email,
                Phone: phone,
                NewPassword: password || null
            };
            await userService.updateProfile(payload);
            setSnackbar({ open: true, message: SUCCESS_MESSAGES.PROFILE_UPDATED, severity: 'success' });
            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            console.error('Error updating profile:', err);
            setSnackbar({ open: true, message: ERROR_MESSAGES.PROFILE_UPDATE_FAILED, severity: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GlassDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <GlassDialogTitle>Редактирование профиля</GlassDialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <div style={{ display: 'grid', gap: 12, paddingTop: 20 }}>
                    <GlassInput
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <GlassInput
                        label="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                    <GlassInput
                        label="Новый пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <GlassInput
                        label="Подтвердите пароль"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                </div>
            </DialogContent>
            <GlassDialogActions>
                <GlassButton onClick={onClose} variant="text">Отмена</GlassButton>
                <GlassButton onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>{isSubmitting ? 'Сохранение...' : 'Сохранить'}</GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default ProfileEditModal;
