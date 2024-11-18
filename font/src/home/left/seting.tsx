import React from 'react';
import { Box, Typography, } from '@mui/material';
import { SettingsOutlined } from '@mui/icons-material';
import SettingComWallet from './settingComWallet';

const SettingComponent: React.FC = () => {
    return (
        <Box> 
            <Box display="flex" mt={2} flexDirection="row" justifyContent="center" alignItems="center">
                <SettingsOutlined />
                <Typography variant="h6" fontWeight={700}>
                    Sniper Settings
                </Typography>
            </Box>
            <Box mt={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                {/* Setting Collapse  */}
                <SettingComWallet />
            </Box>
        </Box>
    );
};

export default SettingComponent;
