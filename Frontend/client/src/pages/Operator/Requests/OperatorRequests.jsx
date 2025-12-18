import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Typography, CircularProgress, InputAdornment, MenuItem, Select } from '@mui/material';
import { Search as SearchIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { requestsService } from '../../../api'; 
import { 
    PageContainer, 
    PageCard,
    HeaderSection,
    FilterSection,
    BoardContainer,
    menuPaperStyles,
    StyledFilterControl // Используем наш стилизованный контрол
} from './OperatorRequests.styles';
import { GlassInput, AppSnackbar, GlassSelect } from '../../../components/common';
import KanbanColumn from './components/KanbanColumn';
import RequestDetailsModal from '../../Requests/components/RequestDetailsModal';
import { REQUEST_STATUSES, REQUEST_CATEGORY_LABELS, REQUESTS_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../utils/constants';


const OperatorRequests = () => {
    const [updatingRequest, setUpdatingRequest] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '' // Изначально пусто
    });
    
    // Модалка
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [sendingComment, setSendingComment] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Колонки канбана
    const columns = [
        { id: REQUEST_STATUSES.NEW, title: 'Новые', color: '#0288D1' }, 
        { id: REQUEST_STATUSES.IN_PROGRESS, title: 'В работе', color: '#ED6C02' }, 
        { id: REQUEST_STATUSES.CLOSED, title: 'Выполнены', color: '#2E7D32' }, 
        { id: REQUEST_STATUSES.REJECTED, title: 'Отклонены', color: '#d32f2f' } 
    ];

    useEffect(() => {
        fetchRequests();
    }, [filters.category]); 

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRequests();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const fetchRequests = async () => {
        try {
            // Передаем параметры как есть.
            // Если category выбрана, передаем её название (например, "Сантехника").
            // Бэкенд должен ожидать именно строку, если в методе сервиса параметр string? category.
            const params = {
                search: filters.search || undefined,
                category: filters.category || undefined
            };
            const response = await requestsService.getOperatorRequests(params);
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setSnackbar({ open: true, message: ERROR_MESSAGES.REQUESTS_LOAD_FAILED || REQUESTS_MESSAGES.DETAILS_LOAD_FAILED, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const newStatus = parseInt(destination.droppableId);
        const requestId = parseInt(draggableId);

        // Оптимистичное обновление
        const updatedRequests = requests.map(req => 
            req.requestId === requestId 
                ? { ...req, status: newStatus } 
                : req
        );
        setRequests(updatedRequests);

        try {
            await requestsService.updateOperatorRequest(requestId, { status: newStatus });
            // Если перенесли в "Новые", надо бы перезагрузить список, 
            // чтобы получить данные без рейтинга (т.к. мы обнулили его на бэке)
            if (newStatus === REQUEST_STATUSES.NEW) {
                 fetchRequests();
            }
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.STATUS_UPDATED, severity: 'success' });
        } catch (error) {
            console.error('Error updating status:', error);
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.STATUS_UPDATE_FAILED, severity: 'error' });
            fetchRequests(); // Откат
        }
    };

    // ... handleCardClick и handleAddComment такие же как были ...
    const handleCardClick = async (request) => {
        try {
            const response = await requestsService.getRequestDetails(request.requestId);
            setSelectedRequest(response.data);
            setDetailsOpen(true);
        } catch (error) {
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.DETAILS_LOAD_FAILED, severity: 'error' });
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setSendingComment(true);
        try {
            await requestsService.addComment(selectedRequest.requestId, { text: newComment });
            const response = await requestsService.getRequestDetails(selectedRequest.requestId);
            setSelectedRequest(response.data);
            setNewComment('');
        } catch (error) {
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.COMMENT_SEND_FAILED, severity: 'error' });
        } finally {
            setSendingComment(false);
        }
    };

    const handleUpdateRequest = async (requestId, updates) => {
        setUpdatingRequest(true);
        try {
            await requestsService.updateOperatorRequest(requestId, updates);
            
            // Обновляем локальный стейт
            setRequests(prev => prev.map(r => 
                r.requestId === requestId 
                    ? { ...r, ...updates }
                    : r
            ));
            
            // Обновляем выбранную заявку
            if (selectedRequest?.requestId === requestId) {
                setSelectedRequest(prev => ({ ...prev, ...updates }));
            }
            
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.REQUEST_UPDATED, severity: 'success' });
        } catch (error) {
            console.error('Error updating request:', error);
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.REQUEST_UPDATE_FAILED, severity: 'error' });
        } finally {
            setUpdatingRequest(false);
        }
    };

    const getRequestsByStatus = (status) => {
        return requests.filter(r => r.status === status);
    };

    return (
        <PageContainer>
            <PageCard>
                <HeaderSection>
                    <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DashboardIcon color="primary" fontSize="large" />
                        Диспетчерская
                    </Typography>
                </HeaderSection>

                <FilterSection>
                    <GlassInput 
                        placeholder="Поиск по номеру, адресу, описанию..." // 3. Вернули плейсхолдер
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        size="small"
                        sx={{ width: 350, m: 0 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                    
                    <StyledFilterControl size="small">
                        <GlassSelect
                            label="Категория"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            options={[{ value: '', label: 'Все категории' }, ...Object.entries(REQUEST_CATEGORY_LABELS).map(([key, label]) => ({ value: label, label }))]}
                            size="small"
                            sx={{ minWidth: '220px' }}
                        />
                    </StyledFilterControl>
                </FilterSection>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <BoardContainer>
                            {columns.map(col => (
                                <KanbanColumn
                                    key={col.id}
                                    statusId={col.id}
                                    title={col.title}
                                    color={col.color}
                                    requests={getRequestsByStatus(col.id)}
                                    onCardClick={handleCardClick}
                                />
                            ))}
                        </BoardContainer>
                    </DragDropContext>
                )}
            </PageCard>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />

            <RequestDetailsModal
                open={detailsOpen}
                onClose={() => {
                    setDetailsOpen(false);
                    setSelectedRequest(null);
                    setNewComment('');
                }}
                request={selectedRequest}
                newComment={newComment}
                setNewComment={setNewComment}
                onAddComment={handleAddComment}
                isSubmittingComment={sendingComment}
                rating={selectedRequest?.rating || 0}
                setRating={() => {}} 
                ratingComment=""
                setRatingComment={() => {}}
                onRateRequest={() => {}}
                isSubmittingRating={false}
                isOperatorView={true}
                onUpdateRequest={handleUpdateRequest}
                isUpdatingRequest={updatingRequest}
            />
        </PageContainer>
    );
};

export default OperatorRequests;