import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
)
