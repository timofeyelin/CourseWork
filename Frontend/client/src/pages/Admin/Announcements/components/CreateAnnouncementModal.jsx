import { 
    DialogContent, 
    Checkbox, 
    CircularProgress 
} from '@mui/material';
import { 
    GlassButton, 
    GlassDialog, 
    GlassDialogTitle, 
    GlassDialogActions,
    GlassInput 
} from '../../../../components/common';
import {
    FormContainer,
    StyledFormControlLabel
} from '../AdminAnnouncements.styles';

const CreateAnnouncementModal = ({ 
    open, 
    onClose, 
    formData, 
    onInputChange, 
    onSubmit, 
    submitting 
}) => {
    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <GlassDialogTitle>Новое объявление</GlassDialogTitle>
            <DialogContent>
                <FormContainer>
                    <GlassInput
                        label="Заголовок"
                        name="title"
                        value={formData.title}
                        onChange={onInputChange}
                        fullWidth
                        required
                    />
                    <GlassInput
                        label="Содержание"
                        name="content"
                        value={formData.content}
                        onChange={onInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        required
                    />
                    <StyledFormControlLabel
                        control={
                            <Checkbox
                                checked={formData.isEmergency}
                                onChange={onInputChange}
                                name="isEmergency"
                                color="error"
                            />
                        }
                        label="Срочное объявление"
                    />
                </FormContainer>
            </DialogContent>
            <GlassDialogActions>
                <GlassButton onClick={onClose} color="inherit">
                    Отмена
                </GlassButton>
                <GlassButton 
                    onClick={onSubmit}
                    disabled={submitting}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Опубликовать'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default CreateAnnouncementModal;
