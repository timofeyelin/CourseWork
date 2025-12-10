import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import { ROUTES } from './utils/constants';
import { LoadingContainer, AppContainer, MainContent } from './App.styles';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
      return (
          <LoadingContainer>
              <CircularProgress />
          </LoadingContainer>
      );
  }

  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent component="main">
          <Routes>
            <Route path={ROUTES.HOME} element={isAuthenticated ? <Home/> : <Landing/>}/>
            <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.REGISTER} element={<Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.PROFILE} element={isAuthenticated ? <Profile/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.PAYMENTS} element={isAuthenticated ? <Payments/> : <Navigate to={ROUTES.HOME} />}/>
            {/* Redirect old routes to new payments page */}
            <Route path={ROUTES.BILLS} element={<Navigate to={`${ROUTES.PAYMENTS}?tab=pay`} replace />}/>
            <Route path={ROUTES.PAYMENT_HISTORY} element={<Navigate to={`${ROUTES.PAYMENTS}?tab=history`} replace />}/>
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App
