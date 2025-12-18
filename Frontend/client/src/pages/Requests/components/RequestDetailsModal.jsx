import { 
    Dialog,
    DialogContent, 
    Typography, 
    IconButton, 
    CircularProgress,
    Box,
    Chip,
    Divider,
    Rating,
    TextField
} from '@mui/material';
import { useState, useEffect } from 'react';  
import { useAuth } from '../../../context/AuthContext';
import dayjs from 'dayjs';
import { 
    Close as CloseIcon, 
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    Download as DownloadIcon,
    Flag as FlagIcon,
    Event as DeadlineIcon
} from '@mui/icons-material';
import { 
    GlassButton, 
    GlassDialog, 
    GlassDialogTitle, 
    GlassDialogActions, 
    GlassInput,
    GlassDatePicker,
    GlassSelect
} from '../../../components/common';
import { 
    REQUEST_STATUS_LABELS, 
    REQUEST_STATUS_COLORS,
    REQUEST_CATEGORY_LABELS,
    REQUEST_STATUSES,
    REQUEST_PRIORITY_LABELS,
    API_BASE_URL
} from '../../../utils/constants';
import {
    ModalContent,
    CommentSection,
    CommentList,
    CommentItem,
    CommentHeader,
    CommentText,
    RatingSection,
    AttachmentList,
    AttachmentItem
} from '../Requests.styles';
import {
    PreviewImageContainer,
    ClosePreviewButton,
    PreviewImage,
    PreviewDialogContent,
    CommentInputContainer,
    SendButton,
    RatingContainer,
    RatingInput,
    SubmitRatingButton,
    CommentAvatar,
    CommentInputWrapper,
    CommentInputField
} from './RequestDetailsModal.styles';

const RequestDetailsModal = ({ 
    open, 
    onClose, 
    request, 
    newComment, 
    setNewComment, 
    onAddComment, 
    isSubmittingComment,
    rating,
    setRating,
    ratingComment,
    setRatingComment,
    onRateRequest,
    isSubmittingRating,
    isOperatorView = false,
    onUpdateRequest,
    isUpdatingRequest = false
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    
    const [editPriority, setEditPriority] = useState(2);
    const [editDeadline, setEditDeadline] = useState(null);

    useEffect(() => {
        if (request) {
            setEditPriority(request.priority ?? 2);
            setEditDeadline(request.deadline ? dayjs(request.deadline) : null);
        }
    }, [request]);

    const { user } = useAuth();

    if (!request) return null;

    const getFullUrl = (uri) => {
        if (!uri) return uri;
        if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
        const base = API_BASE_URL.replace(/\/api\/?$/, '');
        return `${base}${uri}`;
    };

    const handlePreviewOpen = (url) => {
        setPreviewUrl(getFullUrl(url));
        setPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setPreviewOpen(false);
        setPreviewUrl('');
    };

const handleSaveChanges = () => {
    if (onUpdateRequest) {
        const updates = {};

        if (editPriority !== (request.priority ?? 2)) {
            updates.priority = editPriority;
        }

        const currentDeadline = request.deadline ? dayjs(request.deadline) : null;
        const isDeadlineChanged =
            (!!editDeadline || !!currentDeadline) &&
            (!(editDeadline && currentDeadline) || !editDeadline.isSame(currentDeadline, 'day'));

        if (isDeadlineChanged) {
            updates.deadline = editDeadline ? editDeadline.toDate().toISOString() : null;
        }

        if (Object.keys(updates).length > 0) {
            onUpdateRequest(request.requestId, updates);
        }
    }
};

    const previewDialogPaperProps = {
        sx: {
            background: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
        }
    };

    const previewDialogBackdropProps = { 
        sx: { backgroundColor: 'rgba(0,0,0,0.7)' } 
    };

    const currentDeadline = request.deadline ? dayjs(request.deadline) : null;
    const hasChanges = 
        editPriority !== (request.priority ?? 2) ||
        (!!editDeadline || !!currentDeadline) &&
+       (!(editDeadline && currentDeadline) || !editDeadline.isSame(currentDeadline, 'day'));

    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <GlassDialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Заявка №{request.requestId}</Typography>
                    <Chip 
                        label={REQUEST_STATUS_LABELS[request.status]} 
                        color={REQUEST_STATUS_COLORS[request.status]}
                        size="small"
                    />
                </Box>
            </GlassDialogTitle>
            <DialogContent>
                <ModalContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">Категория</Typography>
                            <Typography variant="body1">{request.category}</Typography>
                        </Box>
                        
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">Описание</Typography>
                            <Typography variant="body1">{request.description}</Typography>
                        </Box>

                        {/* СЕКЦИЯ ОПЕРАТОРА: Приоритет и Дедлайн */}
                        {isOperatorView && (
                            <>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FlagIcon color="primary" fontSize="small" />
                                        Управление заявкой
                                    </Typography>
                                    
                                    <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                                        {/* Приоритет */}
                                        <GlassSelect
                                            label="Приоритет"
                                            value={editPriority}
                                            onChange={(e) => setEditPriority(Number(e.target.value))}
                                            options={Object.entries(REQUEST_PRIORITY_LABELS).map(([value, label]) => ({ value: Number(value), label }))}
                                            size="small"
                                            sx={{ minWidth: 180, backgroundColor: 'rgba(255,255,255,0.95)' }}
                                        />

                                        {/* Дедлайн */}
                                        <GlassDatePicker
                                            label="Дедлайн"
                                            value={editDeadline}
                                            onChange={(newValue) => setEditDeadline(newValue)}
                                            placeholder="DD.MM.YYYY"
                                            format="DD.MM.YYYY"
                                            sx={{ minWidth: 180 }}
                                            disablePast={false}
                                        />

                                        {/* Кнопка сохранения */}
                                        <GlassButton
                                            variant="contained"
                                            onClick={handleSaveChanges}
                                            disabled={!hasChanges || isUpdatingRequest}
                                            sx={{ alignSelf: 'center' }}
                                        >
                                            {isUpdatingRequest ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                'Сохранить'
                                            )}
                                        </GlassButton>
                                    </Box>
                                </Box>
                            </>
                        )}

                        {request.attachments && request.attachments.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Вложения
                                </Typography>
                                <AttachmentList>
                                    {request.attachments.map((att) => (
                                        <AttachmentItem
                                            key={att.attachmentId}
                                            onClick={() => {
                                                if (att.fileType && att.fileType.startsWith('image/')) {
                                                    handlePreviewOpen(att.fileUri);
                                                } else {
                                                    window.open(getFullUrl(att.fileUri), '_blank');
                                                }
                                            }}
                                        >
                                            <AttachFileIcon fontSize="small" color="primary" />
                                            <Typography variant="body2" noWrap style={{ flex: 1, fontWeight: 500 }}>
                                                {att.fileUri.split('/').pop()}
                                            </Typography>
                                            <IconButton 
                                                size="small" 
                                                href={getFullUrl(att.fileUri)} 
                                                target="_blank"
                                                download
                                            >
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </AttachmentItem>
                                    ))}
                                </AttachmentList>
                            </Box>
                        )}

                        <Divider />

                        {/* Секция оценки — ТОЛЬКО для владельца (не оператора) */}
                        {request.status === REQUEST_STATUSES.CLOSED && !request.rating && !isOperatorView && (
                            <RatingSection>
                                <Typography variant="h6" gutterBottom>Оцените выполнение</Typography>
                                <Rating
                                    value={rating}
                                    onChange={(event, newValue) => setRating(newValue)}
                                    size="large"
                                />
                                <RatingInput
                                    placeholder="Комментарий к оценке (необязательно)"
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                                <SubmitRatingButton 
                                    onClick={onRateRequest}
                                    disabled={!rating || isSubmittingRating}
                                >
                                    Отправить оценку
                                </SubmitRatingButton>
                            </RatingSection>
                        )}

                        {/* Показ существующей оценки */}
                        {request.rating && (
                            <RatingContainer>
                                <Typography variant="subtitle2" gutterBottom>
                                    {isOperatorView ? 'Оценка жителя' : 'Ваша оценка'}
                                </Typography>
                                <Rating value={request.rating} readOnly />
                                {request.userCommentOnRating && (
                                    <Typography variant="body2" color="textSecondary">
                                        {request.userCommentOnRating}
                                    </Typography>
                                )}
                            </RatingContainer>
                        )}

                        <CommentSection>
                            <Typography variant="h6" gutterBottom>Комментарии</Typography>
                            <CommentList>
                                {request.comments && request.comments.length > 0 ? (
                                    request.comments.map((comment) => {
                                        const isOwn = user && comment.authorId === user.id;
                                        return (
                                            <CommentItem key={comment.commentId} isOwn={isOwn}>
                                                <CommentHeader>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <CommentAvatar>
                                                            {comment.authorName[0]}
                                                        </CommentAvatar>
                                                        <Typography variant="caption" fontWeight="bold">
                                                            {comment.authorName}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption">
                                                        {new Date(comment.createdAt).toLocaleString('ru-RU')}
                                                    </Typography>
                                                </CommentHeader>
                                                <CommentText>{comment.text}</CommentText>
                                            </CommentItem>
                                        );
                                    })
                                ) : (
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        Нет комментариев
                                    </Typography>
                                )}
                            </CommentList>
                        </CommentSection>
                    </Box>
                </ModalContent>
            </DialogContent>

            {/* Превью изображений */}
            <Dialog
                open={previewOpen}
                onClose={handlePreviewClose}
                maxWidth="lg"
                PaperProps={previewDialogPaperProps}
                BackdropProps={previewDialogBackdropProps}
            >
                <PreviewDialogContent>
                    {previewUrl && (
                        <PreviewImageContainer>
                            <ClosePreviewButton
                                onClick={handlePreviewClose}
                                size="small"
                            >
                                <CloseIcon fontSize="small" />
                            </ClosePreviewButton>
                            <PreviewImage
                                src={previewUrl}
                                alt="preview"
                            />
                        </PreviewImageContainer>
                    )}
                </PreviewDialogContent>
            </Dialog>
            
            {/* Ввод комментария (для незакрытых заявок) */}
            {request.status !== REQUEST_STATUSES.CLOSED && request.status !== REQUEST_STATUSES.REJECTED && (
                <CommentInputContainer>
                    <CommentInputWrapper>
                        <CommentInputField
                            fullWidth
                            placeholder="Напишите комментарий..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            size="small"
                        />
                        <SendButton 
                            onClick={onAddComment}
                            disabled={!newComment.trim() || isSubmittingComment}
                        >
                            {isSubmittingComment ? <CircularProgress size={24} color="inherit" /> : <SendIcon fontSize="small" />}
                        </SendButton>
                    </CommentInputWrapper>
                </CommentInputContainer>
            )}

            <GlassDialogActions>
                <GlassButton onClick={onClose}>Закрыть</GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default RequestDetailsModal;