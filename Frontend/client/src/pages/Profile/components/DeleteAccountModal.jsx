import { DialogContent, Typography, CircularProgress } from '@mui/material';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../../components/common';

const DeleteAccountModal = ({ open, onClose, onConfirm, isDeleting }) => {
    return (
        <GlassDialog
            open={open}
            onClose={onClose}
        >
            <GlassDialogTitle>
                Удаление счета
            </GlassDialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    Вы действительно хотите удалить этот лицевой счет? Это действие нельзя будет отменить.
                </Typography>
            </DialogContent>
            <GlassDialogActions>
                <GlassButton onClick={onClose} variant="text">
                    Отмена
                </GlassButton>
                <GlassButton 
                    onClick={onConfirm} 
                    variant="contained" 
                    color="error"
                    disabled={isDeleting}
                >
                    {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Удалить'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default DeleteAccountModal;
