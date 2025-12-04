import { styled } from '@mui/material/styles';
import { 
    Paper, 
    TableContainer, 
    TableCell, 
    TableRow, 
    FormControl, 
    TextField,
    Button
} from '@mui/material';
import { GlassCard, GlassInput } from '../../components/common';

export const PageContainer = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    background: theme.custom.gradients.mainBg,
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '20px 10px',
    },
}));

export const PageCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
    maxWidth: '1000px',
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

export const ContentSection = styled('div')(({ theme }) => ({
    padding: '2rem 3rem',
    [theme.breakpoints.down('md')]: {
        padding: '1.5rem',
    },
}));

export const FilterSection = styled('div')(({ theme }) => ({
    marginBottom: '2rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.3)',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
}));

const filterControlStyles = (theme) => ({
    minWidth: '200px',
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        minWidth: 'auto',
    },
});

export const StyledFormControl = styled(FormControl)(({ theme }) => filterControlStyles(theme));
export const StyledTextField = styled(GlassInput)(({ theme }) => filterControlStyles(theme));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '20px',
    overflow: 'hidden',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
}));

export const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontWeight: '800',
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(2, 136, 209, 0.08)',
    borderBottom: '2px solid rgba(2, 136, 209, 0.1)',
    borderRight: 'none',
    textAlign: 'center',
    verticalAlign: 'middle',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.8rem',
    padding: '20px 16px',
    '&:last-child': {
        borderRight: 'none',
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        zIndex: 1,
        position: 'relative',
    },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
    borderRight: 'none',
    color: theme.palette.text.primary,
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: '20px 16px',
    fontSize: '0.95rem',
    '&:last-child': {
        borderRight: 'none',
    },
}));

export const LoadingContainer = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
}));

export const ErrorContainer = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    padding: '2rem',
}));

export const ErrorCard = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
}));

export const RetryButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));
