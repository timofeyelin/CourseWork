import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
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
    AppSnackbar,
    ErrorBox
} from '../../components/common';
import { requestsService, userService } from '../../api';
import { 
    ERROR_MESSAGES, 
    REQUEST_STATUSES, 
    VALIDATION_MESSAGES,
    REQUESTS_MESSAGES,
    SUCCESS_MESSAGES
} from '../../utils/constants';
import {
    PageContainer,
    PageCard,
    HeaderSection,
    PageTitle,
    ContentSection,
    FilterSection,
    LoadingContainer
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
    
    const [statusFilter, setStatusFilter] = useState('All');

    const [createModalOpen, setCreateModalOpen] = useState(false);
    // ИЗМЕНЕНИЕ: category -> categoryId
    const [newRequest, setNewRequest] = useState({
        accountId: '',
        categoryId: '', 
        description: '',
        files: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.HOME);
            return;
        }
        fetchData();
    }, [isAuthenticated, user, navigate]);

    const handleCreateOpen = () => {
        setNewRequest({
            accountId: accounts.length > 0 ? accounts[0].id : '',
            categoryId: '', 
            description: '',
            files: []
        });
        setCreateModalOpen(true);
    };

    const handleCreateClose = () => {
        setCreateModalOpen(false);
    };

    // Константы для валидации файлов (синхронизированы с бэкендом)
    const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const validateFile = (file) => {
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return `Файл "${file.name}": недопустимый тип. Разрешены: JPG, PNG, PDF`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `Файл "${file.name}": размер превышает 5 МБ`;
        }
        return null;
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (newRequest.files.length + files.length > 3) {
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.FILES_TOO_MANY, severity: 'warning' });
            return;
        }

        // Валидация каждого файла
        const errors = [];
        const validFiles = [];
        for (const file of files) {
            const error = validateFile(file);
            if (error) {
                errors.push(error);
            } else {
                validFiles.push(file);
            }
        }

        if (errors.length > 0) {
            setSnackbar({ open: true, message: errors.join('; '), severity: 'error' });
        }

        if (validFiles.length > 0) {
            setNewRequest(prev => ({
                ...prev,
                files: [...prev.files, ...validFiles]
            }));
        }
    };

    const handleRemoveFile = (index) => {
        setNewRequest(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmitRequest = async () => {
        if (!newRequest.accountId) {
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.SELECT_ACCOUNT, severity: 'error' });
            return;
        }

        // ИЗМЕНЕНИЕ: Проверка categoryId вместо category
        if (!newRequest.categoryId) {
            setSnackbar({ open: true, message: "Выберите категорию", severity: 'error' });
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

        // Дополнительная валидация файлов перед отправкой
        for (const file of newRequest.files) {
            const error = validateFile(file);
            if (error) {
                setSnackbar({ open: true, message: error, severity: 'error' });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            // ИЗМЕНЕНИЕ: Отправляем categoryId напрямую
            const requestData = {
                accountId: parseInt(newRequest.accountId),
                categoryId: parseInt(newRequest.categoryId),
                description: newRequest.description
            };
            
            const response = await requestsService.createRequest(requestData);
            const requestId = response.data.requestId;

            // Загружаем файлы и отслеживаем ошибки
            if (newRequest.files.length > 0) {
                const uploadResults = await Promise.allSettled(
                    newRequest.files.map(file => requestsService.uploadAttachment(requestId, file))
                );

                const failedUploads = uploadResults.filter(r => r.status === 'rejected');
                if (failedUploads.length > 0) {
                    // Некоторые файлы не загрузились, но заявка создана
                    const successCount = uploadResults.length - failedUploads.length;
                    setSnackbar({ 
                        open: true, 
                        message: `Заявка создана, но ${failedUploads.length} файл(ов) не загружено. Успешно: ${successCount}`, 
                        severity: 'warning' 
                    });
                    handleCreateClose();
                    fetchData();
                    return;
                }
            }

            setSnackbar({ open: true, message: SUCCESS_MESSAGES.REQUEST_CREATED, severity: 'success' });
            handleCreateClose();
            fetchData();
        } catch (err) {
            console.error('Error creating request:', err);
            const errorMessage = err.response?.data?.message || REQUESTS_MESSAGES.CREATE_FAILED;
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
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
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.DETAILS_LOAD_FAILED, severity: 'error' });
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
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.COMMENT_SEND_FAILED, severity: 'error' });
        } finally {
            setIsSendingComment(false);
        }
    };

    const handleRateRequest = async () => {
        if (rating === 0) {
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.RATE_REQUIRED, severity: 'warning' });
            return;
        }

        setIsSubmittingRating(true);
        try {
            await requestsService.rateRequest(selectedRequest.requestId, { 
                rating: rating, 
                comment: ratingComment 
            });
            
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.RATE_THANK_YOU, severity: 'success' });
            
            const response = await requestsService.getRequestDetails(selectedRequest.requestId);
            setSelectedRequest(response.data);
        } catch (err) {
            console.error('Error rating request:', err);
            setSnackbar({ open: true, message: REQUESTS_MESSAGES.RATE_SEND_FAILED, severity: 'error' });
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        if (statusFilter === 'All') return true;
        // Здесь можно добавить проверку и по категориям, если нужно,
        // но пока фильтруем только по статусу
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
        return <ErrorBox message={error} onRetry={() => window.location.reload()} />;
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