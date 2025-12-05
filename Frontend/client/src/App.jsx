import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Bills from './pages/Bills';
import PaymentHistory from './pages/PaymentHistory';
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
            <Route path={ROUTES.BILLS} element={isAuthenticated ? <Bills/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.PAYMENT_HISTORY} element={isAuthenticated ? <PaymentHistory/> : <Navigate to={ROUTES.HOME} />}/>
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App
