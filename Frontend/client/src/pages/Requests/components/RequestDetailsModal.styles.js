import { styled } from '@mui/material/styles';
import { Box, IconButton, DialogContent, Avatar } from '@mui/material';
import { GlassInput, GlassButton } from '../../../components/common';
import { CommentInputArea } from '../Requests.styles';

export const PreviewImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    boxShadow: theme.shadows[24],
}));

export const ClosePreviewButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
}));

export const PreviewImage = styled('img')({
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    background: '#000',
});

export const PreviewDialogContent = styled(DialogContent)({
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export const CommentInputContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0,0,0,0.05)',
    backgroundColor: 'rgba(255,255,255,0.5)',
}));

export const SendButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    width: 40,
    height: 40,
}));

export const RatingContainer = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
}));

export const AttachmentItemStyled = styled(Box)(({ theme }) => ({
    cursor: 'pointer',
}));

export const RatingInput = styled(GlassInput)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export const SubmitRatingButton = styled(GlassButton)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

export const CommentAvatar = styled(Avatar)(({ theme }) => ({
    width: 24, 
    height: 24, 
    fontSize: '0.75rem'
}));

export const CommentInputWrapper = styled(CommentInputArea)(({ theme }) => ({
    marginTop: 0,
}));

export const CommentInputField = styled(GlassInput)(({ theme }) => ({
    marginBottom: 0,
}));
