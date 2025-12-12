import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const AppSnackbar = ({ open, message, severity = 'success', onClose, duration = 6000 }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled" sx={{ minWidth: 240 }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AppSnackbar;
