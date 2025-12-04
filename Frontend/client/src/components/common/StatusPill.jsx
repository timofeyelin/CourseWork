import { styled } from '@mui/material/styles';

export const StatusPill = styled('span')(({ theme, status }) => {
    let background = 'gray';
    let boxShadow = 'none';

    switch (status) {
        case 'paid':
        case 'Paid':
            background = 'linear-gradient(135deg, #43a047, #2e7d32)';
            boxShadow = '0 4px 10px rgba(46, 125, 50, 0.2)';
            break;
        case 'unpaid':
        case 'Unpaid':
            background = 'linear-gradient(135deg, #e53935, #c62828)';
            boxShadow = '0 4px 10px rgba(198, 40, 40, 0.2)';
            break;
        case 'pending':
        case 'Pending':
            background = 'linear-gradient(135deg, #FFB74D, #F57C00)';
            boxShadow = '0 4px 10px rgba(245, 124, 0, 0.2)';
            break;
        case 'cancelled':
        case 'Cancelled':
            background = 'linear-gradient(135deg, #90A4AE, #607D8B)';
            boxShadow = '0 4px 10px rgba(96, 125, 139, 0.2)';
            break;
        default:
            break;
    }

    return {
        padding: '8px 16px',
        borderRadius: '30px',
        fontWeight: 600,
        fontSize: '0.8rem',
        display: 'inline-flex',
        alignItems: 'center',
        border: 'none',
        color: 'white',
        background,
        boxShadow,
    };
});
