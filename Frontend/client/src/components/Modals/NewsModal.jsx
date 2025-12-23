import { DialogContent, Chip } from '@mui/material';
import { Warning, Notifications, Close, CalendarMonth, Info } from '@mui/icons-material';
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
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_TYPE_LABELS } from '../../../../utils/constants';

const NewsModal = ({ open, news, onClose }) => {
    if (!news) return null;

    const getTypeConfig = (type) => {
        switch (type) {
            case ANNOUNCEMENT_TYPES.EMERGENCY:
                return { icon: <Warning />, color: 'error', label: ANNOUNCEMENT_TYPE_LABELS[type] };
            case ANNOUNCEMENT_TYPES.OUTAGE:
                return { icon: <Info />, color: 'warning', label: ANNOUNCEMENT_TYPE_LABELS[type] };
            default:
                return { icon: <Notifications />, color: 'primary', label: ANNOUNCEMENT_TYPE_LABELS[type] || 'Инфо' };
        }
    };

    const config = getTypeConfig(news.type);

    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <GlassDialogTitle>
                <ModalHeader>
                    {/* Передаем цвет (primary, warning, error) в стили */}
                    <ModalIconWrapper $color={config.color}>
                        {config.icon}
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
                    
                    {/* Тип новости */}
                    <Chip label={config.label} color={config.color} size="small" />
                    
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
        </GlassDialog>
    );
};

export default NewsModal;