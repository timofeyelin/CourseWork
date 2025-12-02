import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#0288D1',
            light: '#E1F5FE',
            dark: '#0277BD',
        },
        secondary: {
            main: '#FF9800',
            dark: '#F57C00',
        },
        success: {
            main: '#4CAF50',
        },
        error: {
            main: '#F44336',
        },
        warning: {
            main: '#FFC107',
        },
        text: {
            primary: '#263238',
            secondary: '#607D8B',
        },
        background: {
            default: '#F5F7FA',
            paper: 'rgba(255, 255, 255, 0.75)',
        },
        divider: '#E0E0E0',
    },
    typography: {
        fontFamily: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif",
        allVariants: {
            color: '#263238',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    custom: {
        gradients: {
            mainBg: 'linear-gradient(135deg, #E3F2FD 0%, #F5F7FA 100%)',
        },
        glass: {
            border: '1px solid rgba(255, 255, 255, 0.8)',
            shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    minHeight: '100vh',
                    minWidth: '320px',
                },
                '#root': {
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    width: '100%',
                },
                a: {
                    textDecoration: 'none',
                    color: '#0288D1',
                    transition: 'color 0.2s',
                    fontWeight: 500,
                    '&:hover': {
                        color: '#0277BD',
                    }
                }
            }
        }
    }
});
