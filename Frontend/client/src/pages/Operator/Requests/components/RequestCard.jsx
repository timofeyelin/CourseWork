import { createPortal } from 'react-dom';
import { Draggable } from '@hello-pangea/dnd';
import { Typography, Box, Chip } from '@mui/material';
import { 
    AccessTime as TimeIcon, 
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Flag as FlagIcon,
    Event as DeadlineIcon
} from '@mui/icons-material';
import { StyledCard, CardHeader, CardMeta, CardTitle, PriorityIndicator } from '../OperatorRequests.styles';
// Маппинг приоритетов
const PRIORITY_CONFIG = {
    1: { label: 'Низкий', color: '#4caf50', bgColor: 'rgba(76, 175, 80, 0.1)' },
    2: { label: 'Обычный', color: '#2196f3', bgColor: 'rgba(33, 150, 243, 0.1)' },
    3: { label: 'Высокий', color: '#ff9800', bgColor: 'rgba(255, 152, 0, 0.1)' },
    4: { label: 'Критический', color: '#f44336', bgColor: 'rgba(244, 67, 54, 0.1)' },
};

const RequestCard = ({ request, index, onClick }) => {
    const formatDate = (dateString, includeYear = false) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        
        if (includeYear) {
            return date.toLocaleDateString('ru-RU', { 
                day: '2-digit', 
                month: 'short',
                year: 'numeric'
            });
        }
        
        return date.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: 'short' 
        });
    };

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    const priorityConfig = PRIORITY_CONFIG[request.priority] || PRIORITY_CONFIG[2];

    return (
        <Draggable draggableId={request.requestId.toString()} index={index}>
            {(provided, snapshot) => {
                const style = {
                    ...provided.draggableProps.style,
                    ...(snapshot.isDragging && {
                        width: provided.draggableProps.style?.width,
                        height: provided.draggableProps.style?.height,
                        transform: `${provided.draggableProps.style?.transform} scale(1.02)`,
                        zIndex: 9999,
                    }),
                };

                const cardComponent = (
                    <StyledCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={style}
                        $isDragging={snapshot.isDragging}
                        $priority={request.priority}
                        onClick={() => onClick(request)}
                    >
                        <CardHeader>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Chip 
                                    label={`№${request.requestId}`} 
                                    size="small" 
                                    variant="outlined" 
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                                <PriorityIndicator $priority={request.priority}>
                                    <FlagIcon sx={{ fontSize: 12 }} />
                                    {priorityConfig.label}
                                </PriorityIndicator>
                            </Box>
                            <Chip 
                                label={request.category || '—'} 
                                size="small" 
                                color="primary"
                                variant="filled"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                        </CardHeader>

                        <CardTitle title={request.description}>
                            {request.shortDescription}
                        </CardTitle>

                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                            <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {request.address}
                            </Typography>
                        </Box>

                        {request.applicantName && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {request.applicantName}
                                </Typography>
                            </Box>
                        )}

                        <CardMeta>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <TimeIcon sx={{ fontSize: 14 }} />
                                {formatDate(request.createdAt)}
                            </Box>
                            
                            {request.deadline && (
                                <Box 
                                    display="flex" 
                                    alignItems="center" 
                                    gap={0.5}
                                    sx={{ 
                                        color: isOverdue(request.deadline) ? 'error.main' : 'warning.main',
                                        fontWeight: 600 
                                    }}
                                >
                                    <DeadlineIcon sx={{ fontSize: 14 }} />
                                    до {formatDate(request.deadline, true)}
                                </Box>
                            )}
                        </CardMeta>
                    </StyledCard>
                );

                if (snapshot.isDragging) {
                    return createPortal(cardComponent, document.body);
                }

                return cardComponent;
            }}
        </Draggable>
    );
};

export default RequestCard;