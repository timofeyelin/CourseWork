export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api'

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password'
}

export const VALIDATION_MESSAGES = {
    REQUIRED: 'Это поле обязательно',
    INVALID_EMAIL_OR_PHONE: 'Некорректный email или номер телефона',
    PASSWORD_MIN_LENGTH: 'Пароль должен содержать минимум 8 символов',
}