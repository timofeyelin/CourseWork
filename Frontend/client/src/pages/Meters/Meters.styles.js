import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
    Box, 
    TableContainer, 
    TableCell, 
    TableRow,
    FormControl,
    Chip,
    IconButton,
    Typography,
    Alert
} from '@mui/material';
import { GlassCard, GlassInput } from '../../components/common';

export const PageContainer = styled('div')(({ theme }) => ({
    minHeight: '100%',
    background: theme.custom.gradients.mainBg,
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        padding: '20px 10px',
    },
}));

export const PageContent = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
}));

export const MetersCard = styled(GlassCard)(({ theme }) => ({
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
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '12px',
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
    '&:first-of-type': {
        borderTopLeftRadius: '12px',
    },
    '&:last-of-type': {
        borderTopRightRadius: '12px',
    },
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

export const FormContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2),
}));

export const SearchInput = styled(GlassInput)(({ theme }) => ({
    width: 300,
    margin: 0,
}));

export const LoadingBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(5),
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
    borderRadius: '8px',
    fontWeight: 600,
}));

export const ActionIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'bgcolor' && prop !== 'hovercolor',
})(({ theme, bgcolor, hovercolor }) => {
    const resolveColor = (colorPath) => {
        if (!colorPath) return null;
        const parts = colorPath.split('.');
        if (parts.length === 2 && theme.palette[parts[0]] && theme.palette[parts[0]][parts[1]]) {
            return theme.palette[parts[0]][parts[1]];
        }
        return colorPath;
    };

    return {
        backgroundColor: resolveColor(bgcolor) || theme.palette.action.hover,
        '&:hover': {
            backgroundColor: resolveColor(hovercolor) || theme.palette.action.selected,
            color: 'white',
        },
    };
});

export const NoDataTypography = styled(Typography)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    color: theme.palette.text.secondary,
}));

export const ActionsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
}));

export const ModalTitleBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    '& .MuiIconButton-root': {
        position: 'absolute',
        right: 0,
        top: 0,
    },
}));

export const ModalContentBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
}));

export const LastReadingBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(2, 136, 209, 0.05)',
    padding: theme.spacing(2),
    borderRadius: '12px',
    border: '1px dashed rgba(2, 136, 209, 0.3)',
}));

export const HistoryTableContainer = styled(StyledTableContainer)(({ theme }) => ({
    maxHeight: 'none',
    overflow: 'hidden',
    background: 'transparent',
    borderRadius: '12px',
}));

export const HistoryValueCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
}));


