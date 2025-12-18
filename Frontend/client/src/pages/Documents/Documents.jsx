import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { 
    Tabs, 
    Tab, 
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
import { 
    Description as DescriptionIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { 
    PageContainer, 
    PageCard, 
    HeaderSection, 
    PageTitle, 
    ContentSection, 
    DocumentsGrid,
    EmptyStateContainer,
    TabsContainer
} from './Documents.styles';
import { ErrorBox } from '../../components/common';
import DocumentCard from './components/DocumentCard';
import DocumentModal from './components/DocumentModal';
import { documentsService } from '../../api/documents';
import { AppSnackbar } from '../../components/common';
import { ERROR_MESSAGES } from '../../utils/constants';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const tabs = [
        { value: 'all', label: 'Все' },
        { value: 'receipt', label: 'Квитанции' },
        { value: 'contract', label: 'Договоры' },
        { value: 'certificate', label: 'Справки' },
    ];

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.HOME);
            return;
        }
        if (user && (user.role === 'Admin' || user.role === 'Operator')) {
            navigate(ROUTES.HOME);
            return;
        }

        loadDocuments();
    }, [activeTab, isAuthenticated, user, navigate]);

    const loadDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const type = activeTab === 'all' ? '' : activeTab;
            const data = await documentsService.getAll(type);
            setDocuments(data);
        } catch (err) {
            console.error('Documents load error:', err);
            const resp = err?.response;
            let serverMessage = '';
            if (resp && resp.data) {
                const data = resp.data;
                if (typeof data === 'string') {
                    serverMessage = data;
                } else if (data.message) {
                    serverMessage = data.message;
                } else if (data.title) {
                    serverMessage = data.title;
                } else {
                    try {
                        serverMessage = JSON.stringify(data);
                    } catch (e) {
                        serverMessage = String(data);
                    }
                }
                serverMessage = `${resp.status} ${resp.statusText}: ${serverMessage}`;
            } else {
                serverMessage = err?.message || (ERROR_MESSAGES.DOCUMENTS_LOAD_FAILED || 'Не удалось загрузить документы');
            }

            setError(serverMessage);
            setSnackbar({
                open: true,
                message: serverMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc);
    };

    const handleCloseModal = () => {
        setSelectedDocument(null);
    };

    const handleDownload = async (doc) => {
        try {
            const result = await documentsService.download(doc.id);
            const blob = result && result.blob ? result.blob : (result instanceof Blob ? result : new Blob([result]));
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const serverFilename = result && result.filename;
            const ext = blob.type === 'application/pdf' ? '.pdf' : '';
            let filename = serverFilename || (doc.title || 'document');
            filename = filename.replace(/[\\/:*?"<>|]+/g, '_').trim();
            if (ext && !filename.toLowerCase().endsWith(ext)) filename += ext;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.DOWNLOAD_RECEIPT_FAILED || 'Не удалось скачать файл',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <PageContainer>
            <PageCard>
                <HeaderSection>
                    <PageTitle>
                        <DescriptionIcon sx={{ mr: 2, fontSize: 32 }} />
                        Документы
                    </PageTitle>
                </HeaderSection>

                <ContentSection>
                    <TabsContainer>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    minHeight: '64px',
                                }
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab key={tab.value} value={tab.value} label={tab.label} />
                            ))}
                        </Tabs>
                    </TabsContainer>

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" flex={1} p={4}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <ErrorBox message={error} onRetry={loadDocuments} />
                    ) : documents.length === 0 ? (
                        <EmptyStateContainer>
                            <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
                            <Typography variant="h6" color="textSecondary">
                                Документы ещё не загружены
                            </Typography>
                        </EmptyStateContainer>
                    ) : (
                        <DocumentsGrid>
                            {documents.map((doc) => (
                                <DocumentCard 
                                    key={doc.id} 
                                    document={doc} 
                                    onClick={handleDocumentClick}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </DocumentsGrid>
                    )}
                </ContentSection>
            </PageCard>

            <DocumentModal 
                open={!!selectedDocument}
                onClose={handleCloseModal}
                document={selectedDocument}
                onDownload={handleDownload}
            />

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </PageContainer>
    );
};

export default Documents;
