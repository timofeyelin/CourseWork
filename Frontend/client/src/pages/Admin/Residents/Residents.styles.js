import { styled } from '@mui/material/styles';
import { Box, Typography, TableContainer, IconButton, TableCell, TableRow, ListItem } from '@mui/material';
import { GlassCard, GlassInput } from '../../../components/common';

// --- Page Layout Styles ---

export const PageContainer = styled('div')(({ theme }) => ({
    minHeight: '100%',
    background: theme.custom.gradients.mainBg,
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '20px 10px',
    },
}));

export const PageCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    overflow: 'hidden',
    animation: 'fadeIn 0.5s ease-out',
    '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
}));

export const HeaderSection = styled('div')(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.4)',
    padding: '2rem 3rem',
    borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    [theme.breakpoints.down('md')]: {
        padding: '1.5rem',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

export const TitleContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
});

export const PageTitle = styled('h1')(({ theme }) => ({
    fontSize: '1.75rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
    },
}));

export const PageSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '1rem',
}));

export const SearchSection = styled('div')(({ theme }) => ({
    padding: '1.5rem 3rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        padding: '1rem 1.5rem',
    },
}));

export const StyledSearchField = styled(GlassInput)({
    maxWidth: '400px',
    width: '100%',
});

export const ContentSection = styled('div')(({ theme }) => ({
    padding: '0 3rem 3rem 3rem',
    [theme.breakpoints.down('md')]: {
        padding: '0 1.5rem 1.5rem 1.5rem',
    },
}));

// --- Table Styles ---

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '20px',
    overflow: 'hidden',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    maxHeight: '600px',
    '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.05)',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '4px',
        '&:hover': {
            background: 'rgba(0,0,0,0.2)',
        },
    },
}));

export const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontWeight: '800',
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(2, 136, 209, 0.08)',
    borderBottom: '2px solid rgba(2, 136, 209, 0.1)',
    textAlign: 'center',
    verticalAlign: 'middle',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.8rem',
    padding: '20px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backdropFilter: 'blur(10px)',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        zIndex: 1,
        position: 'relative',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
    color: theme.palette.text.primary,
    padding: '20px 24px',
    fontSize: '0.95rem',
    verticalAlign: 'middle',
    textAlign: 'center',
}));

export const UserStatusPill = styled('span')(({ theme, isActive }) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '0.85rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: isActive ? '#1b5e20' : '#c62828',
    backgroundColor: isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
    border: `1px solid ${isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`,
}));

export const ActionButton = styled(IconButton)(({ theme, color }) => ({
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: color === 'error' 
            ? 'rgba(211, 47, 47, 0.08)' 
            : 'rgba(25, 118, 210, 0.08)',
        transform: 'scale(1.1)',
    }
}));

// --- Modal Styles ---

export const ModalContentBox = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    padding: '1rem 0',
}));

export const AddAccountBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
}));

export const StyledAccountInput = styled(GlassInput)({
    flex: 1,
});

export const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
    marginBottom: theme.spacing(1),
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.8)',
        transform: 'translateX(4px)',
    }
}));
