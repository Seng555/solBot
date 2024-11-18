import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center', backgroundColor: '#f0f0f0' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        &copy; 2024 SOYO. All rights reserved.
      </Typography>
      <Typography variant="body2" color="warning.main">
        Disclaimer: The use of the bot is at your own risk. SOYO LTD is not responsible for any losses incurred while using Solana Sniper Bot. We only guarantee we will not store any funds from your wallet.
      </Typography>
    </Box>
  );
};

export default Footer;
