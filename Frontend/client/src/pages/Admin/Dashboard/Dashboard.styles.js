import { styled } from '@mui/material/styles';
import { Box, Paper, TableCell, TableRow } from '@mui/material';
import { GlassCard } from '../../../components/common';

export const PageContainer = styled('div')(({ theme }) => ({
    height: '100%', 
    width: '100%',
    background: theme.custom.gradients.mainBg,
    padding: '30px',
    boxSizing: 'border-box',
    overflowY: 'auto', 
    overflowX: 'hidden',
    [theme.breakpoints.down('md')]: {
        padding: '15px',
    },
}));

export const DashboardCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto', 
    minHeight: '100%', 
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible', 
    padding: theme.spacing(3),
    height: 'auto', 
    [theme.breakpoints.down('md')]: {
        padding: '20px',
    },
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap', 
    gap: theme.spacing(2),
}));

export const ScrollableContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    height: 'auto', 
    overflow: 'visible',
}));

// KPI Grid
export const KpiGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: theme.spacing(3),
}));

export const KpiCardItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2.5),
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }
}));

export const KpiIconWrapper = styled(Box)(({ theme, color }) => ({
    padding: theme.spacing(1),
    borderRadius: '12px',
    backgroundColor: color ? `${color}15` : theme.palette.primary.light, // 15 = opacity ~10%
    color: color || theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

// График и Таблица
export const SectionContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const StyledTableContainer = styled(Box)(({ theme }) => ({
    borderRadius: '20px',
    overflow: 'hidden',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
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

export const RankCircle = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'index',
})(({ theme, index }) => {
    let color = theme.palette.grey[400];
    if (index === 0) color = '#FFD700'; // Gold
    if (index === 1) color = '#C0C0C0'; // Silver
    if (index === 2) color = '#CD7F32'; // Bronze

    return {
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };
});