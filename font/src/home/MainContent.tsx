import React from 'react';
import { Grid,  } from '@mui/material';
import Leftcomponent from './left';
import Rightcomponent from './right';

const MainContent: React.FC = () => {

  return (
    <Grid container spacing={2} sx={{ padding: 1, marginTop: 0 }}>
      {/* Left Section */}
       <Leftcomponent />
      
      {/* Right Section */}
       <Rightcomponent />
    </Grid>
  );
};

export default MainContent;
