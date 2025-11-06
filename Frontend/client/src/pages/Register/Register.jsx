import { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Alert, InputAdornment, IconButton, Typography, Box, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api';
import { useFormValidation } from '../../hooks/useFormValidation';
import { registerValidationSchema } from '../../utils/validationSchemas';
import { ROUTES } from '../../utils/constants';
import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    const { errors, validate, validateField, clearError } = useFormValidation(registerValidationSchema);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        const fieldValue = name === 'agreeToTerms' ? checked : value;

        const updatedFormData = {
            ...formData,
            [name]: fieldValue,
        };

        setFormData(updatedFormData);

        if (touched[name] && name !== 'agreeToTerms') {
            validateField(name, fieldValue, updatedFormData);
        }

        if (apiError) {
            setApiError(null);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        if (name !== 'agreeToTerms') {
            validateField(name, value, formData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (!validate(formData)) {
            return;
        }

        if (!formData.agreeToTerms) {
            setApiError('Необходимо согласиться с условиями обработки персональных данных');
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone
            });

            navigate(ROUTES.LOGIN);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка регистрации. Попробуйте снова.';
            setApiError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: '', color: '', width: 0 };
        
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        if (strength <= 2) {
            return { strength: 'Слабый', color: '#f44336', width: 33 };
        } else if (strength <= 4) {
            return { strength: 'Средний', color: '#ff9800', width: 66 };
        } else {
            return { strength: 'Сильный', color: '#4caf50', width: 100 };
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className={styles.container}>
            <Paper elevation={3} className={styles.registerCard}>
                <div className={styles.header}>
                    <Typography variant='h4' component='h1' className={styles.title}>
                        Регистрация
                    </Typography>
                    <Typography variant='body2' component='p' className={styles.subtitle}>
                        Создайте аккаунт для доступа к услугам ЖКХ
                    </Typography>
                </div>

                {apiError && (
                    <Alert severity='error' className={styles.alert}>
                        {apiError}
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <Box className={styles.formField}>
                        <Typography variant='body2' className={styles.fieldLabel}>
                            Фамилия Имя Отчество <span className={styles.required}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            id='fullName'
                            name='fullName'
                            placeholder='Иванов Иван Иванович'
                            type='text'
                            value={formData.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            disabled={isSubmitting}
                            variant='outlined'
                            autoComplete='name'
                            autoFocus
                        />
                    </Box>

                    <Box className={styles.formField}>
                        <Typography variant='body2' className={styles.fieldLabel}>
                            Email <span className={styles.required}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            id='email'
                            name='email'
                            placeholder='example@mail.ru'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isSubmitting}
                            variant='outlined'
                            autoComplete='email'
                        />
                    </Box>

                    <Box className={styles.formField}>
                        <Typography variant='body2' className={styles.fieldLabel}>
                            Номер телефона
                        </Typography>
                        <TextField
                            fullWidth
                            id='phone'
                            name='phone'
                            placeholder='+7 (900) 123-45-67'
                            type='tel'
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            disabled={isSubmitting}
                            variant='outlined'
                            autoComplete='tel'
                        />
                    </Box>

                    <Box className={styles.formField}>
                        <Typography variant='body2' className={styles.fieldLabel}>
                            Пароль <span className={styles.required}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            id='password'
                            name='password'
                            placeholder='Минимум 8 символов'
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isSubmitting}
                            variant='outlined'
                            autoComplete='new-password'
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='toggle password visibility'
                                                onClick={handleTogglePasswordVisibility}
                                                edge='end'
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                        {formData.password && (
                            <Box className={styles.passwordStrength}>
                                <Box className={styles.strengthBarContainer}>
                                    <Box 
                                        className={styles.strengthBar}
                                        style={{ 
                                            width: `${passwordStrength.width}%`,
                                            backgroundColor: passwordStrength.color 
                                        }}
                                    />
                                </Box>
                                <Typography 
                                    variant='caption' 
                                    className={styles.strengthText}
                                    style={{ color: passwordStrength.color }}
                                >
                                    {passwordStrength.strength}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box className={styles.formField}>
                        <Typography variant='body2' className={styles.fieldLabel}>
                            Подтвердите пароль <span className={styles.required}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            id='confirmPassword'
                            name='confirmPassword'
                            placeholder='Повторите пароль'
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            disabled={isSubmitting}
                            variant='outlined'
                            autoComplete='new-password'
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='toggle confirm password visibility'
                                                onClick={handleToggleConfirmPasswordVisibility}
                                                edge='end'
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    <Box className={styles.formOptions}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id='agreeToTerms'
                                    name='agreeToTerms'
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    color='primary'
                                    disabled={isSubmitting}
                                />
                            }
                            label={
                                <Typography variant='body2'>
                                    Я согласен с{' '}
                                    <Link to='/privacy' className={styles.link}>
                                        условиями обработки персональных данных
                                    </Link>
                                    {' '}и{' '}
                                    <Link to='/terms' className={styles.link}>
                                        пользовательским соглашением
                                    </Link>
                                </Typography>
                            }
                        />
                    </Box>

                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        size='large'
                        disabled={isSubmitting}
                        className={styles.submitButton}
                    >
                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>
                    
                    <Typography variant='body2' className={styles.loginText}>
                        Уже есть аккаунт?{' '}
                        <Link to={ROUTES.LOGIN} className={styles.loginLink}>
                            Войти
                        </Link>
                    </Typography>
                </form>
            </Paper>
        </div>
    );
};

export default Register;