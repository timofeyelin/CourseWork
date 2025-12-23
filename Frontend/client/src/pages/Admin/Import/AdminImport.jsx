import React, { useState } from 'react';
import { 
    Typography, Box, CircularProgress, TextField, Alert
} from '@mui/material';
import { CloudUpload as ImportIcon, ContentPaste } from '@mui/icons-material';
import { adminService } from '../../../api';
import { AppSnackbar, GlassButton, GlassCard } from '../../../components/common';
import { PageContainer, HeaderSection } from '../Dashboard/Dashboard.styles';

const AdminImport = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Пример JSON для подсказки
    const placeholder = `[
  {
    "accountNumber": "1001",
    "period": "2025-12-01",
    "items": [
      { "serviceName": "Вода", "tariff": 50, "consumption": 10 }
    ]
  }
]`;

    const handleImport = async () => {
        setResult(null);
        if (!jsonInput.trim()) {
            setSnackbar({ open: true, message: 'Введите данные JSON', severity: 'warning' });
            return;
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonInput);
            if (!Array.isArray(parsedData)) throw new Error("Должен быть массив [...]");
        } catch (e) {
            setSnackbar({ open: true, message: 'Ошибка валидации JSON: ' + e.message, severity: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await adminService.importBills(parsedData);
            // Бэкенд возвращает { message: "Загружено: X, Ошибок: Y" }
            setResult({ success: true, message: response.data.message });
            setSnackbar({ open: true, message: 'Импорт завершен', severity: 'success' });
        } catch (err) {
            console.error(err);
            setResult({ success: false, message: err.response?.data?.message || 'Ошибка сервера' });
            setSnackbar({ open: true, message: 'Ошибка импорта', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <GlassCard sx={{ width: '100%', maxWidth: '800px', p: 4, m: 'auto' }}>
                <HeaderSection>
                    <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                        <ImportIcon color="primary" fontSize="large" />
                        Импорт начислений
                    </Typography>
                </HeaderSection>

                <Box mb={3}>
                    <Typography variant="body1" gutterBottom>
                        Вставьте JSON-массив с начислениями ниже:
                    </Typography>
                    
                    <TextField
                        multiline
                        rows={12}
                        fullWidth
                        variant="outlined"
                        placeholder={placeholder}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.5)', 
                            borderRadius: '12px',
                            fontFamily: 'monospace'
                        }}
                    />
                </Box>

                {result && (
                    <Alert 
                        severity={result.success ? "success" : "error"} 
                        sx={{ mb: 3, borderRadius: '12px' }}
                    >
                        {result.message}
                    </Alert>
                )}

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <GlassButton 
                        variant="outlined" 
                        onClick={() => setJsonInput('')}
                        disabled={loading}
                    >
                        Очистить
                    </GlassButton>
                    <GlassButton 
                        variant="contained" 
                        startIcon={<ContentPaste />}
                        onClick={handleImport}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Загрузить данные'}
                    </GlassButton>
                </Box>
            </GlassCard>

            <AppSnackbar 
                open={snackbar.open} 
                message={snackbar.message} 
                severity={snackbar.severity} 
                onClose={() => setSnackbar({ ...snackbar, open: false })} 
            />
        </PageContainer>
    );
};

export default AdminImport;