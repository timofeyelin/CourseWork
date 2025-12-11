import { DialogContent, Chip } from '@mui/material';
import { Warning, Notifications, Close, CalendarMonth } from '@mui/icons-material';
import { GlassDialog, GlassDialogTitle, GlassDialogActions, GlassButton } from '../../../components/common';
import { 
    ModalHeader, 
    ModalIconWrapper, 
    CloseButtonWrapper, 
    CloseButton, 
    NewsMetaInfo, 
    ModalDateWrapper, 
    NewsFullContent 
} from '../Home.styles';

const NewsModal = ({ open, news, onClose }) => {
    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            {news && (
                <>
                    <GlassDialogTitle>
                        <ModalHeader>
                            <ModalIconWrapper isEmergency={news.isEmergency}>
                                {news.isEmergency ? <Warning /> : <Notifications />}
                            </ModalIconWrapper>
                            {news.title}
                        </ModalHeader>
                        <CloseButtonWrapper>
                            <CloseButton onClick={onClose}>
                                <Close />
                            </CloseButton>
                        </CloseButtonWrapper>
                    </GlassDialogTitle>
                    <DialogContent>
                        <NewsMetaInfo>
                            <ModalDateWrapper>
                                <CalendarMonth fontSize="small" />
                                {new Date(news.createdAt).toLocaleDateString('ru-RU', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </ModalDateWrapper>
                            {news.isEmergency && (
                                <Chip label="Важно" color="error" size="small" />
                            )}
                        </NewsMetaInfo>
                        <NewsFullContent>
                            {news.content}
                        </NewsFullContent>
                    </DialogContent>
                    <GlassDialogActions>
                        <GlassButton onClick={onClose}>
                            Закрыть
                        </GlassButton>
                    </GlassDialogActions>
                </>
            )}
        </GlassDialog>
    );
};

export default NewsModal;
