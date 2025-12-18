import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import MetersPage from './pages/Meters';
import Requests from './pages/Requests/Requests';
import AdminAnnouncements from './pages/Admin/Announcements/AdminAnnouncements';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Residents from './pages/Admin/Residents';
import Header from './components/Header';
import OperatorRequests from './pages/Operator/Requests';
import Documents from './pages/Documents';
import { useAuth } from './context/AuthContext';
import { ROUTES } from './utils/constants';
import { LoadingContainer, AppContainer, MainContent } from './App.styles';
import AdminCategories from './pages/Admin/Categories/AdminCategories';

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
            <Route path={ROUTES.DOCUMENTS} element={isAuthenticated ? <Documents/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.METERS} element={isAuthenticated ? <MetersPage/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.REQUESTS} element={isAuthenticated ? <Requests/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.ADMIN_ANNOUNCEMENTS} element={isAuthenticated ? <AdminAnnouncements/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.ADMIN_RESIDENTS} element={isAuthenticated ? <Residents/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.BILLS} element={<Navigate to={`${ROUTES.PAYMENTS}?tab=pay`} replace />}/>
            <Route path={ROUTES.PAYMENT_HISTORY} element={<Navigate to={`${ROUTES.PAYMENTS}?tab=history`} replace />}/>
            <Route path={ROUTES.OPERATOR_REQUESTS} element={isAuthenticated ? <OperatorRequests/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={isAuthenticated ? <Dashboard/> : <Navigate to={ROUTES.HOME} />}/>
            <Route path={ROUTES.ADMIN_CATEGORIES} element={isAuthenticated ? <AdminCategories/> : <Navigate to={ROUTES.HOME} />}/>
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App
