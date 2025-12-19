import { useState } from 'react';
import { Checkbox, FormControlLabel, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { loginValidationSchema } from '../../utils/validationSchemas';
import { ROUTES, ERROR_MESSAGES } from '../../utils/constants';
import { GlassInput } from '../common';
import {
    Header,
    LogoIconWrapper,
    StyledIcon,
    Title,
    Subtitle,
    StyledAlert,
    Form,
    FormField,
    FieldLabel,
    LoginFormOptions as FormOptions,
    ForgotLink,
    SubmitButton,
    Divider,
    BottomText as RegisterText,
    StyledLink as RegisterLink
} from './Auth.styles';
import { StyledDialog, ModalLoginCard } from './Modal.styles';

const LoginModal = ({ open, onClose, onSwitchToRegister }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    const { errors, validate, validateField } = useFormValidation(loginValidationSchema);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        const fieldValue = name === 'rememberMe' ? checked : value;

        const updatedFormData = { ...formData, [name]: fieldValue };
        setFormData(updatedFormData);

        if (touched[name] && name !== 'rememberMe') {
            validateField(name, fieldValue, updatedFormData);
        }
        if (apiError) setApiError(null);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        if (name !== 'rememberMe') validateField(name, value, formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (!validate(formData)) return;

        setIsSubmitting(true);
        try {
            await login(formData.email, formData.password);
            navigate(ROUTES.HOME);
        } catch (error) {
            const errorMessage = error.response?.data?.message || ERROR_MESSAGES.LOGIN_FAILED;
            setApiError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
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
                    <LogoIconWrapper>
                        <StyledIcon icon="fluent-emoji-flat:office-building" />
                    </LogoIconWrapper>
                    <Title variant='h4' component='h1'>
                        Горизонт онлайн
                    </Title>
                    <Subtitle variant='h6' component='h2'>
                        Вход в личный кабинет
                    </Subtitle>
                </Header>

                {apiError && (
                    <StyledAlert severity='error'>
                        {apiError}
                    </StyledAlert>
                )}
                
                <Form onSubmit={handleSubmit} noValidate>
                    <FormField>
                        <FieldLabel variant='body2'>
                            Email или номер телефона
                        </FieldLabel>
                        <GlassInput
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
                    </FormField>

                    <FormField>
                        <FieldLabel variant='body2'>
                            Пароль
                        </FieldLabel>
                        <GlassInput
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
                    </FormField>

                    <FormOptions>
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
                        <ForgotLink to={ROUTES.FORGOT_PASSWORD} onClick={onClose}>
                            Забыли пароль?
                        </ForgotLink>
                    </FormOptions>

                    <SubmitButton
                        type='submit'
                        fullWidth
                        variant='contained'
                        size='large'
                        disabled={isSubmitting}
                        color="primary"
                    >
                        {isSubmitting ? 'Вход...' : 'Войти'}
                    </SubmitButton>
                    
                    <Divider>
                        <span>или</span>
                    </Divider>
                    
                    <RegisterText variant='body2'>
                        Нет аккаунта?{' '}
                        <RegisterLink to="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>
                            Зарегистрироваться
                        </RegisterLink>
                    </RegisterText>
                </Form>
            </ModalLoginCard>
        </StyledDialog>
    );
};

export default LoginModal;