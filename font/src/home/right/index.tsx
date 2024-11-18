import React, { useState } from 'react';
import { Box, Grid, useMediaQuery, useTheme, Tabs, Tab } from '@mui/material';
import LogsComponent from './component/logs';
import FeedbackComponent from './component/Feedback';
import FAQComponent from './component/FAQComponent';

const Rightcomponent: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Grid item xs={12} md={isSmallScreen ? 12 : 8}>
      <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', ml: { xs: 0, md: 5 } }}>
        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs" variant="fullWidth">
          <Tab sx={{fontWeight: '700', fontSize : '0.8rem'}} label="Sniper Logs" />
          <Tab sx={{fontWeight: '700' , fontSize : '0.8rem'}} label="FAQ" />
          <Tab sx={{fontWeight: '700', fontSize : '0.8rem'}} label="Feedback" />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <LogsComponent />
        )}

        {tabValue === 1 && (
          <FAQComponent />
        )}

        {tabValue === 2 && (
          <FeedbackComponent />
        )}
      </Box>
    </Grid>
  );
};

export default Rightcomponent;
