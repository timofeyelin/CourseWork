export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5151/api'

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    BILLS: '/bills',
    METERS: '/meters',
    REQUESTS: '/requests',
    PAYMENT_HISTORY: '/payment-history',
    PAYMENTS: '/payments',
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
    AGREE_TO_TERMS: 'Необходимо согласиться с условиями обработки персональных данных',
    INVALID_PAYMENT_AMOUNT: 'Введите корректную сумму',
    PAYMENT_AMOUNT_EXCEEDS: 'Сумма платежа не может превышать сумму счета',
    SELECT_METER: 'Выберите счетчик',
    ENTER_VALUE: 'Введите значение',
    READING_LESS_THAN_PREVIOUS: 'Значение не может быть меньше предыдущего'
}

export const ERROR_MESSAGES = {
    LOGIN_FAILED: 'Ошибка входа. Проверьте email или пароль.',
    REGISTRATION_FAILED: 'Ошибка регистрации. Попробуйте снова.',
    GENERIC_ERROR: 'Произошла ошибка. Попробуйте позже.',
    PROFILE_LOAD_FAILED: 'Не удалось загрузить данные профиля',
    ADD_ACCOUNT_FAILED: 'Не удалось добавить лицевой счет',
    DELETE_ACCOUNT_FAILED: 'Не удалось удалить лицевой счет',
    BILLS_LOAD_FAILED: 'Не удалось загрузить список счетов',
    BILL_DETAILS_LOAD_FAILED: 'Не удалось загрузить детали счета',
    PAYMENT_HISTORY_LOAD_FAILED: 'Не удалось загрузить историю платежей',
    DOWNLOAD_RECEIPT_FAILED: 'Не удалось скачать квитанцию',
    PAYMENT_FAILED: 'Ошибка при проведении платежа',
    PAYMENT_CANCEL_FAILED: 'Не удалось отменить платеж',
    BALANCE_LOAD_FAILED: 'Не удалось загрузить баланс',
    REQUESTS_LOAD_FAILED: 'Не удалось загрузить заявки',
    NEWS_LOAD_FAILED: 'Не удалось загрузить новости',
    MARK_READ_FAILED: 'Не удалось отметить новость как прочитанную',
    METERS_LOAD_FAILED: 'Не удалось загрузить список счетчиков',
    READINGS_LOAD_FAILED: 'Не удалось загрузить показания',
    SUBMIT_READING_FAILED: 'Ошибка при отправке показаний',
    METER_HISTORY_LOAD_FAILED: 'Не удалось загрузить историю показаний'
}

export const SUCCESS_MESSAGES = {
    ACCOUNT_ADDED: 'Лицевой счет успешно добавлен',
    ACCOUNT_DELETED: 'Лицевой счет успешно удален',
    PAYMENT_SUCCESS: 'Платеж успешно проведен',
    PAYMENT_PROCESSED: 'Платеж успешно обработан',
    PAYMENT_CANCELLED: 'Платеж успешно отменен',
    READING_SUBMITTED: 'Показания успешно переданы'
}

export const INFO_MESSAGES = {
    EDIT_PROFILE_UNAVAILABLE: 'Функционал редактирования профиля будет доступен позже',
    DEFAULT_USER_NAME: 'Пользователь',
    ADDRESS_NOT_FOUND: 'Адрес не найден',
    DOWNLOAD_RECEIPT_MOCK: 'Скачивание квитанции... (Mock)',
    PAYMENT_SUCCESS_MOCK: 'Платеж успешно проведен (Mock)'
}

export const PASSWORD_STRENGTH = {
    WEAK: 'Слабый',
    MEDIUM: 'Средний',
    STRONG: 'Сильный'
}