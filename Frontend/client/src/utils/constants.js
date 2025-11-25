export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api'

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    FORGOT_PASSWORD: '/forgot-password'
}

export const VALIDATION_MESSAGES = {
    REQUIRED: 'Это поле обязательно',
    INVALID_EMAIL_OR_PHONE: 'Некорректный email или номер телефона',
    PASSWORD_MIN_LENGTH: 'Пароль должен содержать минимум 8 символов',
    INVALID_ACCOUNT_NUMBER: 'Номер лицевого счета должен содержать только цифры',
    MIN_LENGTH_2: 'Минимум 2 символа',
    ONLY_LETTERS: 'Только буквы, пробелы и дефисы',
    INVALID_EMAIL: 'Неверный формат email',
    INVALID_PHONE: 'Неверный формат телефона',
    PASSWORD_REQUIREMENTS: 'Должен содержать заглавную букву, строчную букву и цифру',
    CONFIRM_PASSWORD: 'Подтвердите пароль',
    PASSWORDS_DO_NOT_MATCH: 'Пароли не совпадают',
    AGREE_TO_TERMS: 'Необходимо согласиться с условиями обработки персональных данных'
}

export const ERROR_MESSAGES = {
    LOGIN_FAILED: 'Ошибка входа. Проверьте email или пароль.',
    REGISTRATION_FAILED: 'Ошибка регистрации. Попробуйте снова.',
    GENERIC_ERROR: 'Произошла ошибка. Попробуйте позже.',
    PROFILE_LOAD_FAILED: 'Не удалось загрузить данные профиля',
    ADD_ACCOUNT_FAILED: 'Не удалось добавить лицевой счет',
    DELETE_ACCOUNT_FAILED: 'Не удалось удалить лицевой счет'
}

export const SUCCESS_MESSAGES = {
    ACCOUNT_ADDED: 'Лицевой счет успешно добавлен',
    ACCOUNT_DELETED: 'Лицевой счет успешно удален'
}

export const INFO_MESSAGES = {
    EDIT_PROFILE_UNAVAILABLE: 'Функционал редактирования профиля будет доступен позже',
    DEFAULT_USER_NAME: 'Пользователь',
    ADDRESS_NOT_FOUND: 'Адрес не найден'
}

export const PASSWORD_STRENGTH = {
    WEAK: 'Слабый',
    MEDIUM: 'Средний',
    STRONG: 'Сильный'
}