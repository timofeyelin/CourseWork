import { useState, useEffect } from 'react';
import { InputAdornment, CircularProgress, Snackbar, Alert } from '@mui/material';
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

    useEffect(() => {
        loadData();
    }, []);

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
        meter.accountId.toString().includes(filterAccount)
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

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={6000} 
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </PageContent>
        </PageContainer>
    );
};

export default MetersPage;
