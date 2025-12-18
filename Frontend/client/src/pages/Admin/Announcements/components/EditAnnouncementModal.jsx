import React from 'react';
import { DialogContent, Checkbox, CircularProgress, IconButton } from '@mui/material';
import { Close as CloseIcon, Campaign as CampaignIcon } from '@mui/icons-material';
import { GlassButton, GlassDialog, GlassDialogTitle, GlassDialogActions, GlassInput } from '../../../../components/common';
import { FormContainer, StyledFormControlLabel, FormOptions, ModalHeader, ModalIconWrapper, ModalSubtitle, ModalCloseButton } from '../AdminAnnouncements.styles';

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
                <ModalSubtitle>Измените заголовок, содержание и срочность объявления.</ModalSubtitle>
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
                    <FormOptions>
                        <StyledFormControlLabel
                            control={
                                <Checkbox
                                    checked={!!announcement.isEmergency}
                                    onChange={onChange}
                                    name="isEmergency"
                                />
                            }
                            label="Срочное объявление"
                        />
                    </FormOptions>
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
