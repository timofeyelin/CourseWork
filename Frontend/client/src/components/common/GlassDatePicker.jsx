import React from 'react';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
        '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 15px rgba(2, 136, 209, 0.15)',
        }
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: '12px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
    }
}));

const popperSx = {
    '& .MuiPaper-root': {
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        marginTop: '8px',
    },
    '& .MuiPickersDay-root': {
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: 'rgba(2, 136, 209, 0.1)',
        },
        '&.Mui-selected': {
            backgroundColor: '#0288d1', // theme.palette.primary.main
            '&:hover': {
                backgroundColor: '#01579b',
            }
        }
    },
    '& .MuiDayCalendar-weekDayLabel': {
        color: '#0288d1',
        fontWeight: 600,
    }
};

export const GlassDatePicker = ({ label, value, onChange, sx, className, ...props }) => {
    return (
        <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            enableAccessibleFieldDOMStructure={false}
            slots={{
                textField: StyledTextField
            }}
            slotProps={{
                popper: {
                    sx: popperSx
                },
                textField: {
                    size: 'small',
                    sx: sx,
                    className: className,
                    ...props
                }
            }}
        />
    );
};
