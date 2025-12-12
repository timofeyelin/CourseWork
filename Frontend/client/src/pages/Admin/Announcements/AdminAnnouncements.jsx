import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    DialogContent, 
    CircularProgress
} from '@mui/material';
import { 
    Add as AddIcon,
    Campaign as CampaignIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { announcementsService } from '../../../api';
import { ROUTES, ANNOUNCEMENTS_MESSAGES } from '../../../utils/constants';
import { 
    GlassButton, 
    GlassDialog, 
    GlassDialogTitle, 
    GlassDialogActions,
    AppSnackbar
} from '../../../components/common';
import {
    PageContainer,
    PageCard,
    HeaderSection,
    PageTitle,
    ContentSection
} from './AdminAnnouncements.styles';
import AnnouncementsTable from './components/AnnouncementsTable';
import CreateAnnouncementModal from './components/CreateAnnouncementModal';

const AdminAnnouncements = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isEmergency: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.HOME);
            return;
        }
        if (user && user.role !== 'Admin') {
            navigate(ROUTES.HOME);
        }
        if (user && user.role === 'Admin') {
            fetchAnnouncements();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user, navigate]);

    const fetchAnnouncements = async () => {
        try {
            const response = await announcementsService.getAll();
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
            showSnackbar(ANNOUNCEMENTS_MESSAGES.LOAD_FAILED, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setFormData({ title: '', content: '', isEmergency: false });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            showSnackbar(ANNOUNCEMENTS_MESSAGES.VALIDATION_REQUIRED, 'error');
            return;
        }

        setSubmitting(true);
        try {
            await announcementsService.create(formData);
            showSnackbar(ANNOUNCEMENTS_MESSAGES.CREATE_SUCCESS, 'success');
            handleCloseDialog();
            fetchAnnouncements();
        } catch (error) {
            console.error('Failed to create announcement:', error);
            showSnackbar(ANNOUNCEMENTS_MESSAGES.CREATE_FAILED, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedAnnouncement) return;

        try {
            await announcementsService.delete(selectedAnnouncement.announcementId);
            showSnackbar(ANNOUNCEMENTS_MESSAGES.DELETE_SUCCESS, 'success');
            setDeleteConfirmOpen(false);
            fetchAnnouncements();
        } catch (error) {
            console.error('Failed to delete announcement:', error);
            showSnackbar(ANNOUNCEMENTS_MESSAGES.DELETE_FAILED, 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <PageContainer>
                <CircularProgress />
            </PageContainer>
        );
    }

    if (!user || user.role !== 'Admin') {
        return null; 
    }

    return (
        <PageContainer>
            <PageCard>
                <HeaderSection>
                    <PageTitle>
                        <CampaignIcon fontSize="large" />
                        Управление объявлениями
                    </PageTitle>
                    <GlassButton 
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                    >
                        Создать объявление
                    </GlassButton>
                </HeaderSection>

                <ContentSection>
                    <AnnouncementsTable 
                        announcements={announcements}
                        onDeleteClick={handleDeleteClick}
                    />
                </ContentSection>
            </PageCard>

            <CreateAnnouncementModal
                open={openDialog}
                onClose={handleCloseDialog}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                submitting={submitting}
            />

            {/* Delete Confirmation Dialog */}
            <GlassDialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <GlassDialogTitle>Подтверждение удаления</GlassDialogTitle>
                <DialogContent>
                    Вы действительно хотите удалить объявление "{selectedAnnouncement?.title}"?
                </DialogContent>
                <GlassDialogActions>
                    <GlassButton onClick={() => setDeleteConfirmOpen(false)} color="inherit">
                        Отмена
                    </GlassButton>
                    <GlassButton onClick={handleDeleteConfirm} color="error">
                        Удалить
                    </GlassButton>
                </GlassDialogActions>
            </GlassDialog>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </PageContainer>
    );
};

export default AdminAnnouncements;
