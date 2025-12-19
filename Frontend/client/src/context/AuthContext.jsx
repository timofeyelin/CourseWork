import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../api';
import { paymentService } from '../api/payments';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await userService.getProfile();
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setIsLoading(false);
    };

    const [balance, setBalance] = useState(0);
    const [debt, setDebt] = useState(0);

    const refreshBalance = async () => {
        try {
            const data = await paymentService.getBalance();
            setBalance(data.balance ?? 0);
            setDebt(data.debt ?? 0);
        } catch (e) {
            console.warn('Failed to refresh balance', e);
        }
    };

    useEffect(() => {
        (async () => {
            await checkAuth();
            const token = localStorage.getItem('accessToken');
            if (token) await refreshBalance();
        })();
    }, []);

    const login = async (email, password) => {
        try {
            await authService.login(email, password);
            await checkAuth();
            closeModals();
            await refreshBalance();
            return true;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const openLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const openRegister = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    const closeModals = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
    };

    const isAdmin = !!user && user.role === 'Admin';
    const isOperator = !!user && user.role === 'Operator';
    const isAdminOrOperator = isAdmin || isOperator;
    const isResident = isAuthenticated && !isAdminOrOperator;

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isLoginOpen,
            isRegisterOpen,
            balance,
            debt,
            refreshBalance,
            isAdmin,
            isOperator,
            isAdminOrOperator,
            isResident,
            login,
            logout,
            openLogin,
            openRegister,
            closeModals
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
