import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export const GlassInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '12px',
        borderColor: theme.palette.divider,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '0.95rem',
    },
    '& .MuiOutlinedInput-input::placeholder': {
        fontSize: '0.9rem',
    },
}));
