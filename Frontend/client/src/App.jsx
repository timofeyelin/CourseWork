import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Bills from './pages/Bills';
import PaymentHistory from './pages/PaymentHistory';
import { ROUTES } from './utils/constants';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={isAuthenticated ? <Home/> : <Landing/>}/>
        <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.HOME} />}/>
        <Route path={ROUTES.REGISTER} element={<Navigate to={ROUTES.HOME} />}/>
        <Route path={ROUTES.PROFILE} element={isAuthenticated ? <Profile/> : <Navigate to={ROUTES.HOME} />}/>
        <Route path={ROUTES.BILLS} element={isAuthenticated ? <Bills/> : <Navigate to={ROUTES.HOME} />}/>
        <Route path={ROUTES.PAYMENT_HISTORY} element={isAuthenticated ? <PaymentHistory/> : <Navigate to={ROUTES.HOME} />}/>
      </Routes>
    </Router>
  );
}

export default App
