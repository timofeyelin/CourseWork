import { DialogContent, CircularProgress } from '@mui/material';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton, GlassInput } from '../../../components/common';
import { AddAccountDescription } from '../Profile.styles';

const AddAccountModal = ({ 
    open, 
    onClose, 
    onAdd, 
    accountNumber, 
    setAccountNumber, 
    error, 
    isSubmitting 
}) => {
    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
        >
            <GlassDialogTitle>
                Добавить лицевой счет
            </GlassDialogTitle>
            <DialogContent>
                <AddAccountDescription variant="body2">
                    Введите номер вашего лицевого счета для привязки к профилю.
                </AddAccountDescription>
                <GlassInput
                    autoFocus
                    margin="dense"
                    label="Номер лицевого счета"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <GlassDialogActions>
                <GlassButton onClick={onClose} variant="text">
                    Отмена
                </GlassButton>
                <GlassButton 
                    onClick={onAdd} 
                    variant="contained"
                    disabled={isSubmitting}
                    color="primary"
                >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Привязать'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default AddAccountModal;
