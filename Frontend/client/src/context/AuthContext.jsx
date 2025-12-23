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
    const [accounts, setAccounts] = useState([]);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await userService.getProfile();
                setUser(response.data);
                setIsAuthenticated(true);
                setIsLoading(false);
                return response.data;
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
                setIsAuthenticated(false);
                setIsLoading(false);
                return null;
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return null;
        }
    };

    const [balance, setBalance] = useState(0);
    const [debt, setDebt] = useState(0);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    const refreshBalance = async (accountId = selectedAccountId) => {
        try {
            const data = await paymentService.getBalance(accountId);
            setBalance(data.balance ?? 0);
            setDebt(data.debt ?? 0);
        } catch (e) {
            console.warn('Failed to refresh balance', e);
        }
    };

    const selectAccount = async (accountId) => {
        setSelectedAccountId(accountId);
        await refreshBalance(accountId);
    };

    const fetchAccounts = async () => {
        try {
            const response = await userService.getAccounts();
            const fetchedAccounts = response.data || [];
            setAccounts(fetchedAccounts);

            if (fetchedAccounts.length > 0) {
                const currentAccountExists = fetchedAccounts.some(acc => acc.id === selectedAccountId);
                if (!selectedAccountId || !currentAccountExists) {
                    await selectAccount(fetchedAccounts[0].id);
                }
            } else {
                setSelectedAccountId(null);
                setBalance(0);
                setDebt(0);
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        }
    };

    useEffect(() => {
        (async () => {
            const userData = await checkAuth();
            if (userData && userData.role !== 'Admin' && userData.role !== 'Operator') {
                await fetchAccounts();
            }
        })();
    }, []);

    const login = async (email, password) => {
        try {
            await authService.login(email, password);
            const userData = await checkAuth();
            closeModals();
            if (userData && userData.role !== 'Admin' && userData.role !== 'Operator') {
                await fetchAccounts();
            }
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
            accounts,
            fetchAccounts,
            selectedAccountId,
            selectAccount,
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
