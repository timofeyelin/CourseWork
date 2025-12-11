import { styled } from '@mui/material/styles';
import { FormControl, Select, MenuItem } from '@mui/material';

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 200,
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

export const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: '12px',
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    margin: '4px 8px',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: 'rgba(2, 136, 209, 0.08)',
    },
    '&.Mui-selected': {
        backgroundColor: 'rgba(2, 136, 209, 0.15)',
        '&:hover': {
            backgroundColor: 'rgba(2, 136, 209, 0.25)',
        }
    }
}));

export const menuPaperStyles = {
    borderRadius: '12px',
    marginTop: '8px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.5)',
    backdropFilter: 'blur(20px)',
    background: 'rgba(255,255,255,0.9)',
};
