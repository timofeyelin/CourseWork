import { styled } from '@mui/material/styles';
import { 
    TableContainer, 
    TableCell, 
    TableRow, 
    FormControl, 
    Box,
    Button,
    Avatar
} from '@mui/material';
import { GlassCard, GlassInput } from '../../../components/common';

export const TabCard = styled(GlassCard)(({ theme }) => ({
    width: '100%',
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
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
}));

export const FilterControl = styled(FormControl)(({ theme }) => ({
    minWidth: '250px',
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        minWidth: 'auto',
    },
}));

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
    minHeight: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

export const ErrorContainer = styled('div')(({ theme }) => ({
    minHeight: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

export const ModalInfoSection = styled('div')(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
}));

export const ModalInfoRow = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px dashed rgba(0, 0, 0, 0.05)',
    gap: '16px',
    '&:last-child': {
        borderBottom: 'none',
        paddingBottom: 0,
    },
}));

export const BillDetailsTable = styled(TableContainer)(({ theme }) => ({
    marginTop: '1rem',
    marginBottom: '1.5rem',
    background: 'transparent',
    boxShadow: 'none',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    overflow: 'hidden',
}));

export const ModalTableCellHead = styled(TableCell)(({ theme }) => ({
    fontWeight: '700',
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
}));

export const ModalTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    color: theme.palette.text.primary,
}));

export const ModalTableRow = styled(TableRow)(({ theme }) => ({
    '&:last-child .MuiTableCell-root': {
        borderBottom: 'none',
    },
}));

export const TotalAmount = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(2, 136, 209, 0.05) 0%, rgba(2, 136, 209, 0.1) 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(2, 136, 209, 0.1)',
    marginTop: '1rem',
}));

export const PaymentInput = styled(GlassInput)(({ theme }) => ({
    marginTop: '1rem',
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
}));

export const RetryButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export const PaymentModalContent = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));

export const PaymentAmountContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const PaymentWalletIconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        fontSize: 48,
        color: theme.palette.primary.main,
        opacity: 0.8,
    },
}));

export const PaymentInfoRowContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%',
}));

export const PaymentInfoAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: 'rgba(2, 136, 209, 0.1)',
    color: theme.palette.primary.main,
    width: 40,
    height: 40,
}));

export const PaymentInfoText = styled(Box)(({ theme }) => ({
    textAlign: 'left',
}));
