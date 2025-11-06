import { VALIDATION_MESSAGES } from "./constants";

export const loginValidationSchema = (data) => {
    const errors = {};

    if (!data.email || data.email.trim() === ''){
        errors.email = VALIDATION_MESSAGES.REQUIRED;
    } else {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
        
        if (!emailRegex.test(data.email) && !phoneRegex.test(data.email)) {
            errors.email = VALIDATION_MESSAGES.INVALID_EMAIL_OR_PHONE;
        }
    }

    if (!data.password || data.password.trim() === ''){
        errors.password = VALIDATION_MESSAGES.REQUIRED;
    } else if (data.password.length < 8){
        errors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    }

    if (Object.keys(errors).length > 0){
        throw errors;
    }
    
    return true;
}

export const registerValidationSchema = (data) => {
    const errors = {};

    // Валидация ФИО
    if (!data.fullName || data.fullName.trim() === '') {
        errors.fullName = VALIDATION_MESSAGES.REQUIRED;
    } else if (data.fullName.trim().length < 2) {
        errors.fullName = 'Минимум 2 символа';
    } else if (!/^[А-Яа-яЁёA-Za-z\s-]+$/.test(data.fullName)) {
        errors.fullName = 'Только буквы, пробелы и дефисы';
    }

    // Валидация Email
    if (!data.email || data.email.trim() === '') {
        errors.email = 'Email обязателен';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.email = 'Неверный формат email';
        }
    }

    // Валидация телефона (необязательное поле)
    if (data.phone && data.phone.trim() !== '') {
        const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        if (!phoneRegex.test(data.phone)) {
            errors.phone = 'Неверный формат телефона';
        }
    }

    // Валидация пароля
    if (!data.password || data.password.trim() === '') {
        errors.password = 'Пароль обязателен';
    } else if (data.password.length < 8) {
        errors.password = 'Минимум 8 символов';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
        errors.password = 'Должен содержать заглавную букву, строчную букву и цифру';
    }

    // Валидация подтверждения пароля
    if (!data.confirmPassword || data.confirmPassword.trim() === '') {
        errors.confirmPassword = 'Подтвердите пароль';
    } else if (data.confirmPassword !== data.password) {
        errors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(errors).length > 0) {
        throw errors;
    }
    
    return true;
}