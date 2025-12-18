import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSnackAlert = styled(Alert, {
    shouldForwardProp: (prop) => prop !== 'severity',
})(({ theme, severity }) => {
    const sev = severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : severity === 'info' ? 'info' : 'success';
    const accent = theme.palette[sev] ? theme.palette[sev].main : theme.palette.success.main;
    return {
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: theme.palette.text.primary,
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
        minWidth: 280,
        padding: theme.spacing(1.25, 2),
        alignItems: 'center',
        '& .MuiAlert-icon': {
            color: accent,
            marginRight: theme.spacing(1.25),
        },
        '& .MuiAlert-message': {
            padding: 0,
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: accent,
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
        },
    };
});

const AppSnackbar = ({ open, message, severity = 'success', onClose, duration = 6000 }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ pb: 3, pr: 3 }}
        >
            <StyledSnackAlert onClose={onClose} severity={severity} variant="standard">
                {message}
            </StyledSnackAlert>
        </Snackbar>
    );
};

export default AppSnackbar;
