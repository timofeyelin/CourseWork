import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ROUTES } from './utils/constants';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home/>}/>
        <Route path={ROUTES.LOGIN} element={<Login/>}/>
        <Route path={ROUTES.REGISTER} element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App
