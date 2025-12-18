import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { 
    Description as DescriptionIcon, 
    PictureAsPdf as PdfIcon, 
    Image as ImageIcon,
    Download as DownloadIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const CardContainer = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.8)',
    },
}));

const IconWrapper = styled(Box)(({ theme, type }) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: type === 'pdf' ? 'rgba(244, 67, 54, 0.1)' : 
                type === 'img' ? 'rgba(33, 150, 243, 0.1)' : 
                'rgba(117, 117, 117, 0.1)',
    color: type === 'pdf' ? '#f44336' : 
           type === 'img' ? '#2196f3' : 
           '#757575',
}));

const InfoWrapper = styled(Box)({
    flex: 1,
    overflow: 'hidden',
});

const Title = styled(Typography)({
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

const Meta = styled(Typography)(({ theme }) => ({
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
}));

const DocumentCard = ({ document, onClick, onDownload }) => {
    const getIcon = (type) => {
        if (type?.includes('pdf')) return <PdfIcon />;
        if (type?.includes('image') || type?.includes('jpg') || type?.includes('png')) return <ImageIcon />;
        return <DescriptionIcon />;
    };

    const getType = (type) => {
        if (type?.includes('pdf')) return 'pdf';
        if (type?.includes('image') || type?.includes('jpg') || type?.includes('png')) return 'img';
        return 'other';
    };

    const handleDownloadClick = (e) => {
        e.stopPropagation();
        onDownload(document);
    };

    return (
        <CardContainer onClick={() => onClick(document)}>
            <IconWrapper type={getType(document.type)}>
                {getIcon(document.type)}
            </IconWrapper>
            <InfoWrapper>
                <Tooltip title={document.title}>
                    <Title>{document.title}</Title>
                </Tooltip>
                <Meta>
                    {(() => {
                        const raw = document.createdAt ?? document.created_at ?? document.CreatedAt;
                        const date = raw ? new Date(raw) : null;
                        if (date && !isNaN(date.getTime())) {
                            try {
                                return format(date, 'd MMMM yyyy', { locale: ru });
                            } catch (e) {
                                return String(raw);
                            }
                        }
                        return '—';
                    })()}
                </Meta>
            </InfoWrapper>
            <Tooltip title="Скачать">
                <IconButton onClick={handleDownloadClick} size="small">
                    <DownloadIcon />
                </IconButton>
            </Tooltip>
        </CardContainer>
    );
};

export default DocumentCard;
