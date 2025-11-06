import { useState } from 'react';

export const useFormValidation = (validationSchema) => {
    const [errors, setErrors] = useState({});

    const validate = (data) => {
        try {
            validationSchema(data);
            setErrors({});
            return true;
        } catch (validationErrors) {
            setErrors(validationErrors);
            return false;
        }
    };

    const validateField = (fieldName, value, allData) => {
        try {
            const tempData = { ...allData, [fieldName]: value };
            validationSchema(tempData);
            
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
            return true;
        } catch (validationErrors) {
            if (validationErrors[fieldName]) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: validationErrors[fieldName]
                }));
                return false;
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[fieldName];
                    return newErrors;
                });
                return true;
            }
        }
    };

    const clearError = (field) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const clearAllErrors = () => {
        setErrors({});
    };

    return {
        errors,
        validate,
        validateField,
        clearError,
        clearAllErrors,
    };
};