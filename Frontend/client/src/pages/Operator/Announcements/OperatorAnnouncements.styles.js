import { styled } from '@mui/material/styles';
import { 
    TableContainer, 
    TableCell, 
    TableRow, 
    Box,
    FormControlLabel
} from '@mui/material';
import { GlassCard } from '../../../components/common';

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

export const FormContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
}));

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

export const FormOptions = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    '& .MuiCheckbox-root': {
        color: theme.palette.text.secondary,
    },
    '& .MuiCheckbox-root.Mui-checked': {
        color: theme.palette.primary.main,
    },
    '& .MuiCheckbox-root:focus': {
        outline: 'none',
    },
    '& .MuiTypography-root': {
        fontSize: '0.813rem',
        color: theme.palette.text.secondary,
    },
}));

export const ModalHeader = styled('div')(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

export const ModalIconWrapper = styled('div')(({ theme }) => ({
    background: 'rgba(2,136,209,0.08)',
    borderRadius: '50%',
    padding: theme.spacing(1.25),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
        fontSize: '36px',
    },
}));

export const ModalSubtitle = styled('p')(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    textAlign: 'center',
    margin: 0,
    maxWidth: '560px',
}));

export const ModalCloseButton = styled('div')(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
}));
