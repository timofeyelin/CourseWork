import React from 'react';
import { DialogContent, CircularProgress, IconButton, MenuItem } from '@mui/material';
import { Close as CloseIcon, Campaign as CampaignIcon } from '@mui/icons-material';
import { GlassButton, GlassDialog, GlassDialogTitle, GlassDialogActions, GlassInput, GlassSelect } from '../../../../components/common';
import { FormContainer, ModalHeader, ModalIconWrapper, ModalSubtitle, ModalCloseButton } from '../OperatorAnnouncements.styles';
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_TYPE_LABELS } from '../../../../utils/constants';

const EditAnnouncementModal = ({ open, onClose, announcement, onChange, onSubmit, submitting }) => {
    if (!announcement) return null;

    return (
        <GlassDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <ModalHeader>
                <ModalCloseButton>
                    <IconButton aria-label="close" onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </ModalCloseButton>
                <ModalIconWrapper>
                    <CampaignIcon color="primary" />
                </ModalIconWrapper>
                <GlassDialogTitle>Редактировать объявление</GlassDialogTitle>
                <ModalSubtitle>Измените заголовок, содержание и тип объявления.</ModalSubtitle>
            </ModalHeader>

            <DialogContent>
                <FormContainer>
                    <GlassInput
                        label="Заголовок"
                        name="title"
                        value={announcement.title}
                        onChange={onChange}
                        fullWidth
                        required
                    />
                    
                    {/* ЗАМЕНА ЧЕКБОКСА НА SELECT */}
                    <GlassSelect
                        label="Тип объявления"
                        name="type"
                        value={announcement.type} // Теперь используем type
                        onChange={onChange}
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
                        value={announcement.content}
                        onChange={onChange}
                        fullWidth
                        multiline
                        rows={6}
                        required
                    />
                </FormContainer>
            </DialogContent>

            <GlassDialogActions>
                <GlassButton onClick={onClose} variant="text">Отмена</GlassButton>
                <GlassButton onClick={onSubmit} variant="contained" color="primary" disabled={submitting}>
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Сохранить'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default EditAnnouncementModal;