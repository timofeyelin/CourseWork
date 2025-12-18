import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { InputAdornment, CircularProgress } from '@mui/material';
import { Search, Add, Speed } from '@mui/icons-material';
import { 
    PageContainer, 
    PageContent, 
    MetersCard,
    HeaderSection,
    PageTitle,
    ContentSection,
    FilterSection,
    SearchInput,
    LoadingBox
} from './Meters.styles';
import MetersTable from './components/MetersTable';
import MeterHistoryModal from './components/MeterHistoryModal';
import SubmitReadingModal from './components/SubmitReadingModal';
import { metersService } from '../../api/meters';
import { GlassButton } from '../../components/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';
import { AppSnackbar } from '../../components/common';

const MetersPage = () => {
    const [meters, setMeters] = useState([]);
    const [readings, setReadings] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterAccount, setFilterAccount] = useState('');
    
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.HOME);
            return;
        }
        if (user && (user.role === 'Admin' || user.role === 'Operator')) {
            navigate(ROUTES.HOME);
            return;
        }

        loadData();
    }, [isAuthenticated, user, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const metersData = await metersService.getAll();
            setMeters(metersData);
            
            const readingsMap = {};
            await Promise.all(metersData.map(async (meter) => {
                try {
                    const history = await metersService.getHistory(meter.meterId);
                    if (history && history.length > 0) {
                        history.sort((a, b) => new Date(b.period) - new Date(a.period));
                        readingsMap[meter.meterId] = history[0];
                    }
                } catch (e) {
                    console.warn(`Failed to load readings for meter ${meter.meterId}`, e);
                }
            }));
            setReadings(readingsMap);

        } catch (error) {
            console.error('Failed to load meters', error);
            setSnackbar({
                open: true,
                message: ERROR_MESSAGES.METERS_LOAD_FAILED,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenHistory = (meter) => {
        setSelectedMeter(meter);
        setHistoryModalOpen(true);
    };

    const handleOpenSubmit = (meter) => {
        setSelectedMeter(meter);
        setSubmitModalOpen(true);
    };

    const handleSubmitSuccess = () => {
        loadData();
        setSnackbar({
            open: true,
            message: SUCCESS_MESSAGES.READING_SUBMITTED,
            severity: 'success'
        });
    };

    const filteredMeters = meters.filter(meter => 
    meter.accountNumber?.toLowerCase().includes(filterAccount.toLowerCase())
);

    return (
        <PageContainer>
            <PageContent>
                <MetersCard>
                    <HeaderSection>
                        <PageTitle>
                            <Speed fontSize="large" />
                            Приборы учета
                        </PageTitle>
                        <GlassButton 
                            variant="contained" 
                            startIcon={<Add />}
                            onClick={() => handleOpenSubmit(null)}
                        >
                            Подать показания
                        </GlassButton>
                    </HeaderSection>

                    <ContentSection>
                        <FilterSection>
                            <SearchInput
                                label="Поиск по лицевому счету"
                                variant="outlined"
                                size="small"
                                value={filterAccount}
                                onChange={(e) => setFilterAccount(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </FilterSection>

                        {loading ? (
                            <LoadingBox>
                                <CircularProgress />
                            </LoadingBox>
                        ) : (
                            <MetersTable 
                                meters={filteredMeters} 
                                readings={readings}
                                onOpenHistory={handleOpenHistory}
                                onOpenSubmit={handleOpenSubmit}
                            />
                        )}
                    </ContentSection>
                </MetersCard>

                <MeterHistoryModal 
                    open={historyModalOpen} 
                    onClose={() => setHistoryModalOpen(false)} 
                    meter={selectedMeter} 
                />

                <SubmitReadingModal 
                    open={submitModalOpen} 
                    onClose={() => setSubmitModalOpen(false)} 
                    meters={meters}
                    initialMeterId={selectedMeter?.meterId}
                    onSuccess={handleSubmitSuccess}
                    readings={readings}
                />

                <AppSnackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                />
            </PageContent>
        </PageContainer>
    );
};

export default MetersPage;
