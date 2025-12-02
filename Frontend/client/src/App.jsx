import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Bills from './pages/Bills';
import PaymentHistory from './pages/PaymentHistory';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home/>}/>
        <Route path={ROUTES.LOGIN} element={<Login/>}/>
        <Route path={ROUTES.REGISTER} element={<Register/>}/>
        <Route path={ROUTES.PROFILE} element={<Profile/>}/>
        <Route path={ROUTES.BILLS} element={<Bills/>}/>
        <Route path={ROUTES.PAYMENT_HISTORY} element={<PaymentHistory/>}/>
      </Routes>
    </Router>
  );
}

export default App
