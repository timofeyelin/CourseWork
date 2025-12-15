import { styled } from '@mui/material/styles';
import { Box, Paper, FormControl, Typography } from '@mui/material';
import { GlassCard } from '../../../components/common';

// --- Общие стили страницы ---

export const PageContainer = styled('div')(({ theme }) => ({
    height: '100vh',
    background: theme.custom.gradients.mainBg,
    padding: '16px 13px', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    overflow: 'hidden', 
    [theme.breakpoints.down('md')]: {
        padding: '12px 8px',
    },
}));

export const PageCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    overflow: 'hidden', 
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 32px)', 
    maxHeight: '900px',
}));

export const HeaderSection = styled('div')(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.4)',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
}));

export const FilterSection = styled('div')(({ theme }) => ({
    padding: '1rem 2rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.2)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    flexWrap: 'wrap',
    flexShrink: 0,
}));

// --- Стили для Канбана ---

export const BoardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    overflowX: 'hidden', 
    overflowY: 'hidden', 
    flexGrow: 1,
    padding: theme.spacing(2), 
    alignItems: 'stretch',
    height: '100%',
}));

export const ColumnContainer = styled(Box)(({ theme, $isDraggingOver }) => ({
    flex: '1 1 0', 
    minWidth: '220px', 
    maxWidth: '300px', 
    background: $isDraggingOver 
        ? 'rgba(227, 242, 253, 0.8)'
        : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden', 
    transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
    '&:hover': {
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05)',
    },
}));

export const ColumnHeader = styled(Box)(({ theme, color }) => ({
    padding: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
    '& h6': {
        fontWeight: 700,
        color: color || theme.palette.text.primary,
        fontSize: '1rem',
    }
}));

export const TaskList = styled(Box)(({ theme, $isDraggingOver }) => ({
    padding: theme.spacing(1.5),
    flexGrow: 1,
    overflowY: 'auto', 
    overflowX: 'hidden',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    backgroundColor: $isDraggingOver ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
    transition: 'background-color 0.2s ease',
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '3px',
    },
}));

// --- Стили Карточки ---

export const PriorityIndicator = styled(Box)(({ theme, $priority }) => {
    const colors = {
        1: { color: '#4caf50', bg: 'rgba(76, 175, 80, 0.1)' },
        2: { color: '#2196f3', bg: 'rgba(33, 150, 243, 0.1)' },
        3: { color: '#ff9800', bg: 'rgba(255, 152, 0, 0.1)' },
        4: { color: '#f44336', bg: 'rgba(244, 67, 54, 0.1)' },
    };
    const config = colors[$priority] || colors[2];
    
    return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.65rem',
        fontWeight: 600,
        color: config.color,
        backgroundColor: config.bg,
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
    };
});

export const StyledCard = styled(Paper)(({ theme, $isDragging, $priority }) => {
    let borderLeftColor = 'transparent';
    switch ($priority) {
        case 4: borderLeftColor = theme.palette.error.main; break; 
        case 3: borderLeftColor = theme.palette.warning.main; break; 
        case 2: borderLeftColor = theme.palette.info.main; break; 
        default: borderLeftColor = theme.palette.success.main; 
    }

    return {
        padding: theme.spacing(2),
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        boxShadow: $isDragging 
            ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
            : '0 2px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderLeft: `4px solid ${borderLeftColor}`,
        cursor: 'grab',
        '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
            backgroundColor: '#FFFFFF',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
        transition: 'box-shadow 0.2s ease, background-color 0.2s ease, transform 0.15s ease', 
    };
});

export const CardTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.9rem',
    lineHeight: 1.3,
    color: theme.palette.text.primary,
    display: '-webkit-box',
    WebkitLineClamp: 2, 
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
}));

export const CardHeader = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
});

export const CardMeta = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
    paddingTop: theme.spacing(1),
    borderTop: '1px dashed rgba(0,0,0,0.05)',
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
}));

export const StyledFilterControl = styled(FormControl)(({ theme }) => ({
    minWidth: '220px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease-in-out',
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.08)',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        '&.Mui-focused': {
            color: theme.palette.primary.main,
        }
    }
}));

export const menuPaperStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    marginTop: '8px',
};