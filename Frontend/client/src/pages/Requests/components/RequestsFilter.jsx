import { MenuItem, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GlassSelect } from '../../../components/common';
import { REQUEST_STATUS_LABELS } from '../../../utils/constants';

const FilterContainer = styled(Box)(({ theme }) => ({
    minWidth: 200
}));

const RequestsFilter = ({ filterStatus, onFilterChange }) => {
    return (
        <FilterContainer>
            <GlassSelect
                value={filterStatus}
                onChange={(e) => onFilterChange(e.target.value)}
                fullWidth
                size="small"
            >
                <MenuItem value="All">Все заявки</MenuItem>
                {Object.entries(REQUEST_STATUS_LABELS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
            </GlassSelect>
        </FilterContainer>
    );
};

export default RequestsFilter;
