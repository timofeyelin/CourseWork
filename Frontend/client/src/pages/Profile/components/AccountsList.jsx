import { Typography, Tooltip } from '@mui/material';
import { 
    AccountBalanceWallet as WalletIcon, 
    Add as AddIcon, 
    Delete as DeleteIcon, 
    Home as HomeIcon, 
    SquareFoot as AreaIcon, 
    Payment as PaymentIcon, 
    History as HistoryIcon 
} from '@mui/icons-material';
import { ROUTES } from '../../../utils/constants';
import { GlassButton } from '../../../components/common';
import { 
    ContentSection, 
    SectionHeader, 
    SectionTitle, 
    EmptyAccounts, 
    AccountsGrid, 
    AccountCard, 
    AccountHeader, 
    AccountNumberLabel, 
    AccountNumber, 
    DeleteButton, 
    AccountDetails, 
    AccountAddress, 
    AccountArea, 
    AccountActions 
} from '../Profile.styles';

const AccountsList = ({ accounts, onAddAccount, onDeleteAccount, navigate }) => {
    return (
        <ContentSection>
            <SectionHeader>
                <SectionTitle variant="h5">
                    <WalletIcon />
                    Мои лицевые счета
                </SectionTitle>
                <GlassButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    color="primary"
                    onClick={onAddAccount}
                >
                    Добавить счет
                </GlassButton>
            </SectionHeader>

            {accounts.length === 0 ? (
                <EmptyAccounts>
                    <Typography>У вас пока нет привязанных лицевых счетов.</Typography>
                </EmptyAccounts>
            ) : (
                <AccountsGrid>
                    {accounts.map((account) => (
                        <AccountCard key={account.id}>
                            <AccountHeader>
                                <div>
                                    <AccountNumberLabel>Лицевой счет</AccountNumberLabel>
                                    <AccountNumber>{account.accountNumber}</AccountNumber>
                                </div>
                                <Tooltip title="Удалить счет">
                                    <DeleteButton 
                                        size="small" 
                                        onClick={() => onDeleteAccount(account.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </DeleteButton>
                                </Tooltip>
                            </AccountHeader>
                            <AccountDetails>
                                <AccountAddress>
                                    <HomeIcon fontSize="small" />
                                    {account.address}
                                </AccountAddress>
                                <AccountArea>
                                    <AreaIcon />
                                    {account.area} м²
                                </AccountArea>
                            </AccountDetails>
                            <AccountActions>
                                <GlassButton
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<PaymentIcon />}
                                    onClick={() => navigate(`${ROUTES.PAYMENTS}?tab=pay&account=${account.accountNumber}`)}
                                    fullWidth
                                >
                                    Оплатить
                                </GlassButton>
                                <GlassButton
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<HistoryIcon />}
                                    onClick={() => navigate(`${ROUTES.PAYMENTS}?tab=history&account=${account.accountNumber}`)}
                                    fullWidth
                                >
                                    История
                                </GlassButton>
                            </AccountActions>
                        </AccountCard>
                    ))}
                </AccountsGrid>
            )}
        </ContentSection>
    );
};

export default AccountsList;
