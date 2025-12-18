import { 
    DialogContent, 
    Checkbox, 
    CircularProgress,
    Box,
    IconButton,
    Typography,
    Divider
} from '@mui/material';
import { Close as CloseIcon, Campaign as CampaignIcon } from '@mui/icons-material';
import { 
    GlassButton, 
    GlassDialog, 
    GlassDialogTitle, 
    GlassDialogActions,
    GlassInput 
} from '../../../../components/common';
import {
    FormContainer,
    StyledFormControlLabel,
    FormOptions,
    ModalHeader,
    ModalIconWrapper,
    ModalSubtitle,
    ModalCloseButton
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
            <ModalHeader>
                <ModalCloseButton>
                    <IconButton aria-label="close" onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </ModalCloseButton>
                <ModalIconWrapper>
                    <CampaignIcon color="primary" />
                </ModalIconWrapper>
                <GlassDialogTitle>Новое объявление</GlassDialogTitle>
                <ModalSubtitle>
                    Создайте уведомление для жителей. Срочные объявления будут отображаться вверху и как оповещение.
                </ModalSubtitle>
            </ModalHeader>

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
                        rows={6}
                        required
                    />
                    <FormOptions>
                        <StyledFormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isEmergency}
                                    onChange={onInputChange}
                                    name="isEmergency"
                                />
                            }
                            label="Срочное объявление"
                        />
                    </FormOptions>
                </FormContainer>
            </DialogContent>

            <GlassDialogActions>
                <GlassButton onClick={onClose} variant="text">
                    Отмена
                </GlassButton>
                <GlassButton 
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Опубликовать'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default CreateAnnouncementModal;
