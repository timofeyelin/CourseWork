import React, { useState, useEffect } from 'react';
import { 
    Typography, CircularProgress, Box, 
    DialogContent, IconButton 
} from '@mui/material';
import { 
    Category as CategoryIcon, 
    Add as AddIcon, 
    Delete as DeleteIcon 
} from '@mui/icons-material';
import { requestsService } from '../../../api';
import { 
    AppSnackbar, GlassButton, GlassDialog, 
    GlassDialogTitle, GlassDialogActions, GlassInput 
} from '../../../components/common';
import { 
    PageContainer, PageCard, HeaderSection, 
    ContentSection, CategoryList, CategoryItem, DeleteButton 
} from './AdminCategories.styles';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await requestsService.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error(error);
            showSnackbar('Не удалось загрузить категории', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCategoryName.trim()) return;
        
        setSubmitting(true);
        try {
            await requestsService.createCategory(newCategoryName);
            showSnackbar('Категория успешно создана', 'success');
            setNewCategoryName('');
            setOpenModal(false);
            fetchCategories();
        } catch (error) {
            const msg = error.response?.data?.message || 'Ошибка при создании';
            showSnackbar(msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        
        try {
            await requestsService.deleteCategory(id);
            showSnackbar('Категория удалена', 'success');
            // Оптимистичное удаление из списка
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            const msg = error.response?.data?.message || 'Ошибка при удалении (возможно, есть привязанные заявки)';
            showSnackbar(msg, 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <PageContainer>
            <PageCard>
                <HeaderSection>
                    <Typography 
                        variant="h5" 
                        fontWeight="bold" 
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                        <CategoryIcon color="primary" fontSize="large" />
                        Категории заявок
                    </Typography>
                    <GlassButton 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => setOpenModal(true)}
                    >
                        Добавить
                    </GlassButton>
                </HeaderSection>

                <ContentSection>
                    {loading ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <CategoryList>
                            {categories.map((cat) => (
                                <CategoryItem key={cat.id}>
                                    <Typography variant="body1" fontWeight={500}>
                                        {cat.name}
                                    </Typography>
                                    <DeleteButton 
                                        size="small" 
                                        onClick={() => handleDelete(cat.id, cat.name)}
                                    >
                                        <DeleteIcon />
                                    </DeleteButton>
                                </CategoryItem>
                            ))}
                            {categories.length === 0 && (
                                <Typography color="text.secondary" align="center">
                                    Список пуст
                                </Typography>
                            )}
                        </CategoryList>
                    )}
                </ContentSection>
            </PageCard>

            {/* Create Modal */}
            <GlassDialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <GlassDialogTitle>Новая категория</GlassDialogTitle>
                
                <DialogContent sx={{ pt: 3, pb: 2, overflow: 'visible' }}>
                    <GlassInput
                        autoFocus
                        label="Название категории"
                        fullWidth
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        sx={{ mt: 1 }}  // Добавляем отступ сверху для инпута
                    />
                </DialogContent>
                
                <GlassDialogActions>
                    <GlassButton onClick={() => setOpenModal(false)}>Отмена</GlassButton>
                    <GlassButton 
                        variant="contained" 
                        onClick={handleCreate}
                        disabled={submitting || !newCategoryName.trim()}
                    >
                        {submitting ? <CircularProgress size={24} /> : 'Создать'}
                    </GlassButton>
                </GlassDialogActions>
            </GlassDialog>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </PageContainer>
    );
};

export default AdminCategories;