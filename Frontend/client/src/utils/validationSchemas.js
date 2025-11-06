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