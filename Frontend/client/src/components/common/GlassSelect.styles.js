import { styled } from '@mui/material/styles';
import { FormControl, Select, MenuItem } from '@mui/material';

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 200,
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        background: 'transparent',
        transition: 'all 0.12s ease-in-out',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        },
        '&.Mui-focused': {
            boxShadow: '0 4px 12px rgba(2, 136, 209, 0.08)'
        }
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.06)',
        borderRadius: '12px',
        background: 'transparent'
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
    background: 'transparent',
    '& .MuiSelect-select': {
        borderRadius: '12px',
        paddingTop: '8px',
        paddingBottom: '8px',
    }
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
    marginTop: '2px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    border: '1px solid rgba(0,0,0,0.06)',
    backdropFilter: 'blur(20px)',
    background: 'rgba(255,255,255,0.95)',
    maxHeight: '48vh',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.03)',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.12)',
        borderRadius: '4px',
        '&:hover': {
            background: 'rgba(0,0,0,0.18)'
        }
    }
};
