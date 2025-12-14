import { useState, useEffect } from 'react';
import { 
    CircularProgress,
    Typography,
    Box
} from '@mui/material';
import { 
    Assignment as RequestIcon, 
    Add as AddIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { 
    GlassButton,
    AppSnackbar
} from '../../components/common';
import { requestsService, userService } from '../../api';
import { 
    ERROR_MESSAGES, 
    REQUEST_STATUSES, 
    REQUEST_CATEGORIES, 
    REQUEST_CATEGORY_LABELS,
    VALIDATION_MESSAGES
} from '../../utils/constants';
import {
    PageContainer,
    PageCard,
    HeaderSection,
    PageTitle,
    ContentSection,
    FilterSection,
    LoadingContainer,
    ErrorContainer,
    ErrorCard,
    RetryButton
} from './Requests.styles';
import RequestsTable from './components/RequestsTable';
import CreateRequestModal from './components/CreateRequestModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import RequestsFilter from './components/RequestsFilter';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('All');

    // Create Modal State
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        accountId: '',
        category: '',
        description: '',
        files: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Details Modal State
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [isSendingComment, setIsSendingComment] = useState(false);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [requestsRes, accountsRes] = await Promise.all([
                requestsService.getUserRequests(),
                userService.getAccounts()
            ]);
            
            console.log('Requests data from API:', requestsRes.data);
            setRequests(requestsRes.data);
            setAccounts(accountsRes.data);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError(ERROR_MESSAGES.REQUESTS_LOAD_FAILED);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOpen = () => {
        setNewRequest({
            accountId: accounts.length > 0 ? accounts[0].id : '',
            category: REQUEST_CATEGORIES.PLUMBING,
            description: '',
            files: []
        });
        setCreateModalOpen(true);
    };

    const handleCreateClose = () => {
        setCreateModalOpen(false);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (newRequest.files.length + files.length > 3) {
            setSnackbar({
                open: true,
                message: 'Максимум 3 файла',
                severity: 'warning'
            });
            return;
        }
        setNewRequest(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));
    };

    const handleRemoveFile = (index) => {
        setNewRequest(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmitRequest = async () => {
        if (!newRequest.accountId) {
            setSnackbar({
                open: true,
                message: 'Выберите лицевой счет',
                severity: 'error'
            });
            return;
        }

        if (!newRequest.description.trim()) {
            setSnackbar({
                open: true,
                message: VALIDATION_MESSAGES.REQUIRED,
                severity: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const requestData = {
                accountId: parseInt(newRequest.accountId),
                category: REQUEST_CATEGORY_LABELS[newRequest.category] || newRequest.category,
                description: newRequest.description
            };
            
            const response = await requestsService.createRequest(requestData);
            const requestId = response.data.requestId;

            if (newRequest.files.length > 0) {
                await Promise.all(newRequest.files.map(file => 
                    requestsService.uploadAttachment(requestId, file)
                ));
            }

            setSnackbar({
                open: true,
                message: 'Заявка успешно создана',
                severity: 'success'
            });
            handleCreateClose();
            fetchData();
        } catch (err) {
            console.error('Error creating request:', err);
            setSnackbar({
                open: true,
                message: 'Ошибка при создании заявки',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewDetails = async (request) => {
        try {
            const response = await requestsService.getRequestDetails(request.requestId);
            setSelectedRequest(response.data);
            setDetailsModalOpen(true);
            if (response.data.status === REQUEST_STATUSES.CLOSED && !response.data.rating) {
                setRating(0);
                setRatingComment('');
            }
        } catch (err) {
            console.error('Error fetching request details:', err);
            setSnackbar({
                open: true,
                message: 'Не удалось загрузить детали заявки',
                severity: 'error'
            });
        }
    };

    const handleDetailsClose = () => {
        setDetailsModalOpen(false);
        setSelectedRequest(null);
        setNewComment('');
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setIsSendingComment(true);
        try {
            await requestsService.addComment(selectedRequest.requestId, { text: newComment });
            
            const response = await requestsService.getRequestDetails(selectedRequest.requestId);
            setSelectedRequest(response.data);
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
            setSnackbar({
                open: true,
                message: 'Не удалось отправить комментарий',
                severity: 'error'
            });
        } finally {
            setIsSendingComment(false);
        }
    };

    const handleRateRequest = async () => {
        if (rating === 0) {
            setSnackbar({
                open: true,
                message: 'Поставьте оценку',
                severity: 'warning'
            });
            return;
        }

        setIsSubmittingRating(true);
        try {
            await requestsService.rateRequest(selectedRequest.requestId, { 
                rating: rating, 
                comment: ratingComment 
            });
            
            setSnackbar({
                open: true,
                message: 'Спасибо за оценку!',
                severity: 'success'
            });
            
            const response = await requestsService.getRequestDetails(selectedRequest.requestId);
            setSelectedRequest(response.data);
        } catch (err) {
            console.error('Error rating request:', err);
            setSnackbar({
                open: true,
                message: 'Не удалось отправить оценку',
                severity: 'error'
            });
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        if (statusFilter === 'All') return true;
        return req.status.toString() === statusFilter || REQUEST_STATUSES[statusFilter] === req.status;
    });

    if (loading) {
        return (
            <LoadingContainer>
                <CircularProgress />
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <ErrorCard>
                    <Typography color="error" variant="h6">{error}</Typography>
                    <RetryButton onClick={() => window.location.reload()}>Повторить</RetryButton>
                </ErrorCard>
            </ErrorContainer>
        );
    }

    return (
        <PageContainer>
            <PageCard>
                <HeaderSection>
                    <PageTitle>
                        <RequestIcon fontSize="large" />
                        Мои заявки
                    </PageTitle>
                    <GlassButton
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateOpen}
                    >
                        Создать заявку
                    </GlassButton>
                </HeaderSection>

                <ContentSection>
                    <FilterSection>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FilterIcon color="action" />
                            <RequestsFilter 
                                filterStatus={statusFilter} 
                                onFilterChange={setStatusFilter} 
                            />
                        </Box>
                    </FilterSection>

                    <RequestsTable 
                        requests={filteredRequests} 
                        onViewDetails={handleViewDetails} 
                    />
                </ContentSection>
            </PageCard>

            <CreateRequestModal 
                open={createModalOpen}
                onClose={handleCreateClose}
                accounts={accounts}
                newRequest={newRequest}
                setNewRequest={setNewRequest}
                onSubmit={handleSubmitRequest}
                isSubmitting={isSubmitting}
                onFileChange={handleFileChange}
                onRemoveFile={handleRemoveFile}
            />

            <RequestDetailsModal 
                open={detailsModalOpen}
                onClose={handleDetailsClose}
                request={selectedRequest}
                newComment={newComment}
                setNewComment={setNewComment}
                onAddComment={handleAddComment}
                isSubmittingComment={isSendingComment}
                rating={rating}
                setRating={setRating}
                ratingComment={ratingComment}
                setRatingComment={setRatingComment}
                onRateRequest={handleRateRequest}
                isSubmittingRating={isSubmittingRating}
            />

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </PageContainer>
    );
};

export default Requests;
