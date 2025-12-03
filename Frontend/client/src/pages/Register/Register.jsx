import { useState } from 'react';
import { TextField, Checkbox, FormControlLabel, InputAdornment, IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api';
import { useFormValidation } from '../../hooks/useFormValidation';
import { registerValidationSchema, getPasswordStrength } from '../../utils/validationSchemas';
import { ROUTES, ERROR_MESSAGES, VALIDATION_MESSAGES } from '../../utils/constants';
import { GlassInput } from '../../components/StyledComponents';
import {
    RegisterContainer,
    RegisterCard,
    Header,
    Title,
    Subtitle,
    StyledAlert,
    Form,
    FormField,
    FieldLabel,
    RequiredStar,
    PasswordStrength,
    StrengthBarContainer,
    StrengthBar,
    StrengthText,
    FormOptions,
    StyledLink,
    SubmitButton,
    LoginText,
    LoginLink
} from './Register.styles';

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
            setApiError(VALIDATION_MESSAGES.AGREE_TO_TERMS);
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
            const errorMessage = error.response?.data?.message || ERROR_MESSAGES.REGISTRATION_FAILED;
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

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <RegisterContainer>
            <RegisterCard elevation={3}>
                <Header>
                    <Title variant='h4' component='h1'>
                        Регистрация
                    </Title>
                    <Subtitle variant='body2' component='p'>
                        Создайте аккаунт для доступа к услугам ЖКХ
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
                            Фамилия Имя Отчество <RequiredStar>*</RequiredStar>
                        </FieldLabel>
                        <GlassInput
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
                    </FormField>

                    <FormField>
                        <FieldLabel variant='body2'>
                            Email <RequiredStar>*</RequiredStar>
                        </FieldLabel>
                        <GlassInput
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
                    </FormField>

                    <FormField>
                        <FieldLabel variant='body2'>
                            Номер телефона
                        </FieldLabel>
                        <GlassInput
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
                    </FormField>

                    <FormField>
                        <FieldLabel variant='body2'>
                            Пароль <RequiredStar>*</RequiredStar>
                        </FieldLabel>
                        <GlassInput
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
                            <PasswordStrength>
                                <StrengthBarContainer>
                                    <StrengthBar 
                                        style={{ 
                                            width: `${passwordStrength.width}%`,
                                            backgroundColor: passwordStrength.color 
                                        }}
                                    />
                                </StrengthBarContainer>
                                <StrengthText 
                                    variant='caption' 
                                    style={{ color: passwordStrength.color }}
                                >
                                    {passwordStrength.strength}
                                </StrengthText>
                            </PasswordStrength>
                        )}
                    </FormField>

                    <FormField>
                        <FieldLabel variant='body2'>
                            Подтвердите пароль <RequiredStar>*</RequiredStar>
                        </FieldLabel>
                        <GlassInput
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
                    </FormField>

                    <FormOptions>
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
                                    <StyledLink to='/privacy'>
                                        условиями обработки персональных данных
                                    </StyledLink>
                                    {' '}и{' '}
                                    <StyledLink to='/terms'>
                                        пользовательским соглашением
                                    </StyledLink>
                                </Typography>
                            }
                        />
                    </FormOptions>

                    <SubmitButton
                        type='submit'
                        fullWidth
                        variant='contained'
                        size='large'
                        disabled={isSubmitting}
                        color="primary"
                    >
                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </SubmitButton>
                    
                    <LoginText variant='body2'>
                        Уже есть аккаунт?{' '}
                        <LoginLink to={ROUTES.LOGIN}>
                            Войти
                        </LoginLink>
                    </LoginText>
                </Form>
            </RegisterCard>
        </RegisterContainer>
    );
};

export default Register;