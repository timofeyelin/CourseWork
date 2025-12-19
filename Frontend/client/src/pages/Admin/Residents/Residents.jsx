import React, { useState, useEffect, useCallback } from 'react';
import { InputAdornment, Stack } from '@mui/material';
import { Search, People, Add, ReceiptLong, Description } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { adminService } from '../../../api';
import { AppSnackbar } from '../../../components/common';
import { RESIDENTS_MESSAGES, SUCCESS_MESSAGES } from '../../../utils/constants';
import ResidentsTable from './components/ResidentsTable';
import UserDetailsModal from './components/UserDetailsModal';
import CreateAccountModal from '../../../components/Modals/CreateAccountModal';
import AddMeterModal from '../../../components/Modals/AddMeterModal';
import GenerateBillsModal from '../../../components/Modals/GenerateBillsModal';
import { GlassButton } from '../../../components/common';

import { 
    PageContainer, 
    PageCard,
    HeaderSection,
    TitleContainer,
    PageTitle,
    PageSubtitle,
    SearchSection,
    StyledSearchField,
    ContentSection
} from './Residents.styles';

const Residents = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isAccountModalOpen, setAccountModalOpen] = useState(false);
    const [isMeterModalOpen, setMeterModalOpen] = useState(false);
    const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);

    const fetchUsers = async (query = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getUsers(query);
            setUsers(response.data);
        } catch (err) {
            setError(RESIDENTS_MESSAGES.LOAD_FAILED);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((query) => {
            fetchUsers(query);
        }, 500),
        []
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleOpenDetails = (user) => {
        setSelectedUser(user);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedUser(null);
    };
    
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });


    const handleAccountSuccess = () => {
        setSnackbar({ open: true, message: SUCCESS_MESSAGES.ACCOUNT_ADDED, severity: 'success' });
    };

    const handleMeterSuccess = () => {
        setSnackbar({ open: true, message: SUCCESS_MESSAGES.METER_ADDED, severity: 'success' });
    };

    return (
        <PageContainer>
            <PageCard>
                <HeaderSection>
                    <TitleContainer>
                        <PageTitle>
                            <People />
                            Реестр жителей
                        </PageTitle>
                        <PageSubtitle>
                            Управление пользователями и доступом
                        </PageSubtitle>
                    </TitleContainer>
                </HeaderSection>

                <SearchSection>
                    
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={2} 
                        justifyContent="space-between" 
                        alignItems="center"
                        width="100%"
                    >
                        <StyledSearchField
                            placeholder="Поиск по ФИО, телефону, квартире или ЛС"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}
                        />

                            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                            <GlassButton 
                                variant="contained" 
                                startIcon={<Add />}
                                onClick={() => setAccountModalOpen(true)}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Новый ЛС
                            </GlassButton>
                            <GlassButton 
                                variant="outlined" 
                                startIcon={<ReceiptLong />}
                                onClick={() => setMeterModalOpen(true)}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Счетчик
                            </GlassButton>
                            <GlassButton
                                variant="outlined"
                                startIcon={<Description />}
                                onClick={() => setGenerateModalOpen(true)}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Сформировать квитанции
                            </GlassButton>
                        </Stack>
                    </Stack>
                </SearchSection>

                <ContentSection>
                    <ResidentsTable 
                        users={users} 
                        loading={loading} 
                        error={error}
                        onRefresh={() => fetchUsers(searchQuery)}
                        onDetails={handleOpenDetails}
                        setSnackbar={setSnackbar}
                    />
                </ContentSection>
            </PageCard>

            
            {selectedUser && (
                <UserDetailsModal
                    open={isDetailsOpen}
                    onClose={handleCloseDetails}
                    user={selectedUser}
                    onUpdate={async () => {
                        await fetchUsers(searchQuery);
                        try {
                            const updated = (await adminService.getUsers(searchQuery)).data.find(u => u.id === selectedUser.id);
                            if (updated) setSelectedUser(updated);
                        } catch (e) {
                            console.warn('Failed to refresh selected user after update', e);
                        }
                    }}
                    setSnackbar={setSnackbar}
                />
            )}

            
            <CreateAccountModal 
                open={isAccountModalOpen} 
                onClose={() => setAccountModalOpen(false)} 
                onSuccess={handleAccountSuccess}
            />
            
            <AddMeterModal 
                open={isMeterModalOpen} 
                onClose={() => setMeterModalOpen(false)} 
                onSuccess={handleMeterSuccess}
            />
            
            <GenerateBillsModal
                open={isGenerateModalOpen}
                onClose={() => setGenerateModalOpen(false)}
                onResult={(err, data) => {
                    if (err) {
                        console.error(err);
                        setSnackbar({ open: true, message: 'Ошибка при генерации квитанций', severity: 'error' });
                    } else if (data) {
                        setSnackbar({ open: true, message: `Готово: ${data.created} квитанций, пропущено: ${data.skipped}, ошибки: ${data.errors}`, severity: 'success' });
                    }
                }}
            />
            
            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </PageContainer>
    );
};

export default Residents;