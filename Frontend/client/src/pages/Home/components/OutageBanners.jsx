import React from 'react';
import { Box, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { OutageBanner, OutageTitle } from '../Home.styles';

const OutageBanners = ({ outages }) => {
    if (!outages || outages.length === 0) return null;

    return (
        <>
            {outages.map(outage => (
                <OutageBanner key={outage.announcementId}>
                    <Warning color="error" />
                    <Box>
                        <OutageTitle variant="subtitle1">
                            {outage.title}
                        </OutageTitle>
                        <Typography variant="body2">
                            {outage.content}
                        </Typography>
                    </Box>
                </OutageBanner>
            ))}
        </>
    );
};

export default OutageBanners;
