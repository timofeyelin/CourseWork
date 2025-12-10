import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const LoadingContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
});

export const AppContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
});

export const MainContent = styled(Box)({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
});
