import { useState, useEffect } from 'react';
import { 
    DialogContent, 
    MenuItem, 
    Typography, 
    IconButton, 
    CircularProgress,
    Box
} from '@mui/material';
import { 
    Close as CloseIcon, 
    CloudUpload as UploadIcon 
} from '@mui/icons-material';
import { 
    GlassButton, 
    GlassDialog, 
    GlassDialogTitle, 
    GlassDialogActions, 
    GlassInput,
    GlassSelect
} from '../../../components/common';
import { requestsService } from '../../../api'; // Импортируем сервис
import {
    ModalContent,
    FileUploadArea,
    FileList,
    FileItem
} from '../Requests.styles';

const CreateRequestModal = ({ 
    open, 
    onClose, 
    accounts, 
    newRequest, 
    setNewRequest, 
    onSubmit, 
    isSubmitting,
    onFileChange,
    onRemoveFile
}) => {
    // Состояние для категорий
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Загружаем категории при открытии
    useEffect(() => {
        if (open) {
            loadCategories();
        }
    }, [open]);

    const loadCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await requestsService.getCategories();
            setCategories(response.data);
            
            // Если категория еще не выбрана и список не пуст, выберем первую по умолчанию
            if (!newRequest.categoryId && response.data.length > 0) {
                setNewRequest(prev => ({ ...prev, categoryId: response.data[0].id }));
            }
        } catch (error) {
            console.error("Не удалось загрузить категории", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    return (
        <GlassDialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <GlassDialogTitle>Создание заявки</GlassDialogTitle>
            <DialogContent>
                <ModalContent>
                    <GlassSelect
                        label="Лицевой счет"
                        value={newRequest.accountId}
                        onChange={(e) => setNewRequest({...newRequest, accountId: e.target.value})}
                        fullWidth
                    >
                        {accounts.map(acc => (
                            <MenuItem key={acc.id} value={acc.id}>
                                {acc.accountNumber} ({acc.address})
                            </MenuItem>
                        ))}
                    </GlassSelect>

                    {/* Выпадающий список категорий с Бэкенда */}
                    <GlassSelect
                        label="Категория"
                        value={newRequest.categoryId || ''} // Используем categoryId
                        onChange={(e) => setNewRequest({...newRequest, categoryId: e.target.value})}
                        fullWidth
                        disabled={loadingCategories}
                    >
                        {loadingCategories ? (
                            <MenuItem disabled>Загрузка...</MenuItem>
                        ) : (
                            categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))
                        )}
                    </GlassSelect>

                    <GlassInput
                        label="Описание проблемы"
                        multiline
                        rows={4}
                        value={newRequest.description}
                        onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                        fullWidth
                    />

                    <Box>
                        <input
                            accept=".jpg,.jpeg,.png,.pdf"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={onFileChange}
                            disabled={newRequest.files.length >= 3}
                        />
                        <label htmlFor="raised-button-file">
                            <FileUploadArea>
                                <UploadIcon color="primary" fontSize="large" />
                                <Typography variant="body2" color="textSecondary">
                                    Нажмите для загрузки файлов (макс. 3, до 5 МБ)
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Разрешены: JPG, PNG, PDF
                                </Typography>
                            </FileUploadArea>
                        </label>
                        
                        {newRequest.files.length > 0 && (
                            <FileList>
                                {newRequest.files.map((file, index) => (
                                    <FileItem key={index}>
                                        <Typography variant="caption" noWrap style={{ maxWidth: '80%' }}>
                                            {file.name}
                                        </Typography>
                                        <IconButton size="small" onClick={() => onRemoveFile(index)}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </FileItem>
                                ))}
                            </FileList>
                        )}
                    </Box>
                </ModalContent>
            </DialogContent>
            <GlassDialogActions>
                <GlassButton onClick={onClose} variant="text">
                    Отмена
                </GlassButton>
                <GlassButton 
                    onClick={onSubmit} 
                    variant="contained" 
                    color="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Отправить'}
                </GlassButton>
            </GlassDialogActions>
        </GlassDialog>
    );
};

export default CreateRequestModal;