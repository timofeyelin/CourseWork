import { styled } from '@mui/material/styles';
import { Dialog } from '@mui/material';
import { LoginCard, RegisterCard } from './Auth.styles';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        // overflow: 'visible',
    }
}));

export const ModalLoginCard = styled(LoginCard)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95) !important',
}));

export const ModalRegisterCard = styled(RegisterCard)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95) !important',
}));
