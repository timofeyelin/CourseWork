import React from 'react';
import { Box, Typography } from '@mui/material';
import { Warning, Info } from '@mui/icons-material';
import { OutageBanner, OutageTitle } from '../Home.styles';
import { ANNOUNCEMENT_TYPES } from '../../../utils/constants';

const OutageBanners = ({ outages }) => {
    if (!outages || outages.length === 0) return null;

    return (
        <>
            {outages.map(outage => {
                const isEmergency = outage.type === ANNOUNCEMENT_TYPES.EMERGENCY;
                
                return (
                    <OutageBanner 
                        key={outage.announcementId}
                        // Передаем проп для стилей ('error' = красный, иначе оранжевый)
                        $severity={isEmergency ? 'error' : 'warning'}
                    >
                        {isEmergency ? <Warning color="inherit" /> : <Info color="inherit" />}
                        
                        <Box>
                            <OutageTitle variant="subtitle1">
                                {outage.title}
                            </OutageTitle>
                            <Typography variant="body2">
                                {outage.content}
                            </Typography>
                        </Box>
                    </OutageBanner>
                );
            })}
        </>
    );
};

export default OutageBanners;