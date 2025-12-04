import { Typography } from '@mui/material';
import { StyledDialog } from './Modal.styles';
import { GlassButton } from '../common';
import {
    ModalCard,
    Header,
    Content,
    Text,
    Actions
} from './NewsModal.styles';

const NewsModal = ({ open, onClose, newsItem }) => {
    if (!newsItem) return null;

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="body"
        >
            <ModalCard elevation={3}>
                <Header>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color={newsItem.isEmergency ? 'error' : 'textPrimary'}>
                        {newsItem.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                        {new Date(newsItem.createdAt).toLocaleDateString()}
                    </Typography>
                </Header>
                
                <Content>
                    <Text variant="body1">
                        {newsItem.content}
                    </Text>
                </Content>

                <Actions>
                    <GlassButton onClick={onClose} variant="contained" color="primary">
                        Закрыть
                    </GlassButton>
                </Actions>
            </ModalCard>
        </StyledDialog>
    );
};

export default NewsModal;
