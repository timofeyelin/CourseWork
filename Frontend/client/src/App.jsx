import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import MetersPage from './pages/Meters';
import Requests from './pages/Requests/Requests';
import OperatorAnnouncements from './pages/Operator/Announcements/OperatorAnnouncements';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Residents from './pages/Admin/Residents';
import Header from './components/Header';
import OperatorRequests from './pages/Operator/Requests';
import RoleRoute from './components/RoleRoute';
import Documents from './pages/Documents';
import { useAuth } from './context/AuthContext';
import { ROUTES } from './utils/constants';
import { LoadingContainer, AppContainer, MainContent } from './App.styles';
import AdminCategories from './pages/Admin/Categories/AdminCategories';
import AdminAudit from './pages/Admin/Audit/AdminAudit';
import AdminImport from './pages/Admin/Import/AdminImport';

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
      <AuthEventsHandler />
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
            <Route path={ROUTES.OPERATOR_ANNOUNCEMENTS} element={<RoleRoute allowedRoles={["Operator"]} element={<OperatorAnnouncements/>} />}/>
            <Route path={ROUTES.ADMIN_RESIDENTS} element={<RoleRoute allowedRoles={["Admin"]} element={<Residents/>} />}/>
            <Route path={ROUTES.BILLS} element={<Navigate to={`${ROUTES.PAYMENTS}?tab=pay`} replace />}/>
            <Route path={ROUTES.PAYMENT_HISTORY} element={<Navigate to={`${ROUTES.PAYMENTS}?tab=history`} replace />}/>
            <Route path={ROUTES.OPERATOR_REQUESTS} element={<RoleRoute allowedRoles={["Operator"]} element={<OperatorRequests/>} />}/>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<RoleRoute allowedRoles={["Admin"]} element={<Dashboard/>} />}/>
            <Route path={ROUTES.ADMIN_CATEGORIES} element={<RoleRoute allowedRoles={["Admin"]} element={<AdminCategories/>} />}/>
            <Route path={ROUTES.ADMIN_AUDIT} element={<RoleRoute allowedRoles={["Admin"]} element={<AdminAudit/>} />}/>
            <Route path={ROUTES.ADMIN_IMPORT} element={<RoleRoute allowedRoles={["Admin"]} element={<AdminImport/>} />}/>
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

function AuthEventsHandler() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handler = () => {
      try { logout(); } catch (e) { console.warn('logout handler failed', e); }
      try { navigate('/'); } catch (e) { console.warn('navigate failed', e); }
    };

    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, [logout, navigate]);

  return null;
}

export default App
