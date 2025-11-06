import {useState} from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Alert, InputAdornment, IconButton, Typography, Box, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api';
import { useFormValidation } from '../../hooks/useFormValidation';
import { loginValidationSchema } from '../../utils/validationSchemas';
import { ROUTES } from '../../utils/constants';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState ({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    const { errors, validate, validateField, clearError } = useFormValidation(loginValidationSchema);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        const filedValue = name === 'rememberMe' ? checked : value;

        const updatedFormData = {
            ...formData,
            [name]: filedValue,
        };

        setFormData(updatedFormData);

        if (touched[name] && name !== 'rememberMe') {
            validateField(name, filedValue, updatedFormData);
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

        if (name !== 'rememberMe') {
            validateField(name, value, formData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (!validate(formData)) {
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.login(formData.email, formData.password);

            navigate('/'); 

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка входа. Проверьте email или пароль.';
            setApiError(errorMessage);
        } finally{
            setIsSubmitting(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className={styles.container}>
            <Paper elevation={3} className={styles.loginCard}>
                <div className={styles.header}>
                        <div className={styles.logoIcon}>
                            <Icon icon="fluent-emoji-flat:office-building" className={styles.buildingIcon} />
                        </div>
                        <Typography variant='h4' component='h1' className={styles.title}>
                            Горизонт онлайн
                        </Typography>
                        <Typography variant='h6' component='h2' className={styles.subtitle}>
                            Вход в личный кабинет
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
                                Email или номер телефона
                            </Typography>
                            <TextField
                            fullWidth
                            id='email' 
                            name='email'
                            placeholder='example@mail.ru или +7 900 123-45-67'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isSubmitting}
                            variant='outlined'
                            autoComplete='email'
                            autoFocus
                            />
                        </Box>

                        <Box className={styles.formField}>
                            <Typography variant='body2' className={styles.fieldLabel}>
                                Пароль
                            </Typography>
                            <TextField
                            fullWidth
                            id='password'
                            name='password'
                            placeholder='Введите ваш пароль'
                            type={showPassword ? 'text': 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isSubmitting}
                            variant='outlined'
                            autoComplete='current-password'
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={handleTogglePasswordVisibility}
                                            edge='end'
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
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
                                    id='rememberMe'
                                    name='rememberMe'
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    color='primary'
                                    disabled={isSubmitting}
                                    />
                                }
                                label='Запомнить меня'
                            />
                            <Link to={ROUTES.FORGOT_PASSWORD} className={styles.forgotLink}>
                                Забыли пароль?
                            </Link>
                        </Box>

                        <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        size='large'
                        disabled={isSubmitting}
                        className={styles.submitButton}
                        >
                            {isSubmitting ? 'Вход...' : 'Войти'}
                        </Button>
                        
                        <div className={styles.divider}>
                            <span>или</span>
                        </div>
                        
                        <Typography variant='body2' className={styles.registerText}>
                            Нет аккаунта?{' '}
                            <Link to={ROUTES.REGISTER} className={styles.registerLink}>
                                Зарегистрироваться
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </div>
        );
    }

export default Login;