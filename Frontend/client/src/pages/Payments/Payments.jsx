import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { AccountBalanceWallet, History } from '@mui/icons-material';
import { PageContainer, PageContent, StyledTabs, StyledTab, TabPanel } from './Payments.styles';
import PaymentTab from './components/PaymentTab';
import HistoryTab from './components/HistoryTab';

const Payments = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [initialAccount, setInitialAccount] = useState(null);

    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.HOME);
            return;
        }
        if (user && (user.role === 'Admin' || user.role === 'Operator')) {
            navigate(ROUTES.HOME);
            return;
        }

        const tabParam = searchParams.get('tab');
        const accountParam = searchParams.get('account');
        
        if (tabParam === 'history') {
            setActiveTab(1);
        } else {
            setActiveTab(0);
        }

        if (accountParam) {
            setInitialAccount(accountParam);
        }
    }, [searchParams, isAuthenticated, user, navigate]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        const newParams = new URLSearchParams(searchParams);
        if (newValue === 0) {
            newParams.set('tab', 'pay');
        } else {
            newParams.set('tab', 'history');
        }
        if (initialAccount) {
            newParams.set('account', initialAccount);
        }
        setSearchParams(newParams);
    };

    return (
        <PageContainer>
            <PageContent>
                <StyledTabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    centered
                    variant="fullWidth"
                >
                    <StyledTab 
                        icon={<AccountBalanceWallet />} 
                        iconPosition="start" 
                        label="Оплата счетов" 
                    />
                    <StyledTab 
                        icon={<History />} 
                        iconPosition="start" 
                        label="История платежей" 
                    />
                </StyledTabs>

                <TabPanel role="tabpanel" hidden={activeTab !== 0}>
                    {activeTab === 0 && <PaymentTab initialAccount={initialAccount} />}
                </TabPanel>

                <TabPanel role="tabpanel" hidden={activeTab !== 1}>
                    {activeTab === 1 && <HistoryTab initialAccount={initialAccount} />}
                </TabPanel>
            </PageContent>
        </PageContainer>
    );
};

export default Payments;
