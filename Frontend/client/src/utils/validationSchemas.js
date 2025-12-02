import { VALIDATION_MESSAGES, PASSWORD_STRENGTH } from "./constants";

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
        errors.fullName = VALIDATION_MESSAGES.MIN_LENGTH_2;
    } else if (!/^[А-Яа-яЁёA-Za-z\s-]+$/.test(data.fullName)) {
        errors.fullName = VALIDATION_MESSAGES.ONLY_LETTERS;
    }

    // Валидация Email
    if (!data.email || data.email.trim() === '') {
        errors.email = VALIDATION_MESSAGES.REQUIRED;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.email = VALIDATION_MESSAGES.INVALID_EMAIL;
        }
    }

    // Валидация телефона (необязательное поле)
    if (data.phone && data.phone.trim() !== '') {
        const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        if (!phoneRegex.test(data.phone)) {
            errors.phone = VALIDATION_MESSAGES.INVALID_PHONE;
        }
    }

    // Валидация пароля
    if (!data.password || data.password.trim() === '') {
        errors.password = VALIDATION_MESSAGES.REQUIRED;
    } else if (data.password.length < 8) {
        errors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
        errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS;
    }

    // Валидация подтверждения пароля
    if (!data.confirmPassword || data.confirmPassword.trim() === '') {
        errors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD;
    } else if (data.confirmPassword !== data.password) {
        errors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH;
    }

    if (Object.keys(errors).length > 0) {
        throw errors;
    }
    
    return true;
}

export const accountValidationSchema = (accountNumber) => {
    const errors = {};

    if (!accountNumber || accountNumber.trim() === '') {
        errors.accountNumber = VALIDATION_MESSAGES.REQUIRED;
    } else if (!/^\d+$/.test(accountNumber)) {
        errors.accountNumber = VALIDATION_MESSAGES.INVALID_ACCOUNT_NUMBER;
    }

    if (Object.keys(errors).length > 0) {
        throw errors;
    }

    return true;
}

export const paymentValidationSchema = (amount, maxAmount) => {
    const errors = {};

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        errors.amount = VALIDATION_MESSAGES.INVALID_PAYMENT_AMOUNT;
    } else if (Number(amount) > maxAmount) {
        errors.amount = VALIDATION_MESSAGES.PAYMENT_AMOUNT_EXCEEDS;
    }

    if (Object.keys(errors).length > 0) {
        throw errors;
    }

    return true;
}

export const getPasswordStrength = (password) => {
    if (!password) return { strength: '', color: '', width: 0 };
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength <= 2) {
        return { strength: PASSWORD_STRENGTH.WEAK, color: '#f44336', width: 33 };
    } else if (strength <= 4) {
        return { strength: PASSWORD_STRENGTH.MEDIUM, color: '#ff9800', width: 66 };
    } else {
        return { strength: PASSWORD_STRENGTH.STRONG, color: '#4caf50', width: 100 };
    }
};