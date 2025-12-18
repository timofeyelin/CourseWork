import { 
    DialogContent, 
    CircularProgress,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon, Campaign as CampaignIcon } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { 
    GlassButton, 
    GlassDialog, 
    GlassDialogTitle, 
    GlassDialogActions,
    GlassInput, 
    GlassSelect 
} from '../../../../components/common';
import {
    FormContainer,
    ModalHeader,
    ModalIconWrapper,
    ModalSubtitle,
    ModalCloseButton
} from '../AdminAnnouncements.styles';
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_TYPE_LABELS } from '../../../../utils/constants';

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
                    Создайте уведомление для жителей. Аварии и отключения будут отображаться вверху главной страницы.
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
                    
                    <GlassSelect
                        label="Тип объявления"
                        name="type"
                        value={formData.type}
                        onChange={onInputChange}
                        fullWidth
                    >
                        <MenuItem value={ANNOUNCEMENT_TYPES.INFO}>
                            {ANNOUNCEMENT_TYPE_LABELS[ANNOUNCEMENT_TYPES.INFO]}
                        </MenuItem>
                        <MenuItem value={ANNOUNCEMENT_TYPES.OUTAGE}>
                            {ANNOUNCEMENT_TYPE_LABELS[ANNOUNCEMENT_TYPES.OUTAGE]}
                        </MenuItem>
                        <MenuItem value={ANNOUNCEMENT_TYPES.EMERGENCY}>
                            {ANNOUNCEMENT_TYPE_LABELS[ANNOUNCEMENT_TYPES.EMERGENCY]}
                        </MenuItem>
                    </GlassSelect>

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