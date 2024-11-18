import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SniperBotDescription from './botDesc';
import { useLogs } from '../../../Context/LogsContext';

const LogsComponent: React.FC = () => {
    const { logs, clearLogs } = useLogs(); // Access the logs state and methods

    // Scroll to top whenever a new log is added
    useEffect(() => {
        if (logs.length > 0) {
            // Ensure that the log container scrolls only if there are logs
            const logContainer = document.getElementById('logContainer');
            if (logContainer) {
                logContainer.scrollTop = 0;
            }
        }
    }, [logs]);

    // For example purposes, we add a log entry when the component is loaded
    useEffect(() => {
       // addLog("Bot started successfully!");
    }, []);

    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom fontSize={'1rem'}>
                Here you will see the logs with information about all the actions that the Sniper Bot is doing.
            </Typography>
            <Typography variant="body2" gutterBottom fontSize={'1rem'}> 
                This section contains sniper log data.
            </Typography>

            {/* Logs Box */}
            <Box
                id="logContainer"
                sx={{
                    maxHeight: 400,
                    height: 400,
                    overflowY: 'auto',
                    backgroundColor: '#2e2e2e', // Dark background like a console
                    color: '#f5f5f5', // Light text color for contrast
                    fontFamily: 'monospace', // Fixed-width font
                    padding: 1,
                    borderRadius: 1,
                    boxShadow: 1,
                    marginBottom: 2,
                    whiteSpace: 'pre-wrap', // Preserve line breaks and spaces
                    fontSize: '14px', // Adjust text size for readability
                    border: '1px solid #444', // Console-like border
                }}
            >
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <Typography key={index} variant="body2" sx={{ marginBottom: 1 }} fontSize={'1rem'}>
                            {log}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ color: '#777' }} fontSize={'1rem'}>
                        No logs available.
                    </Typography>
                )}
            </Box>

            {/* Button container with Add Log and Clear Log */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {/* Clear Log Button */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={clearLogs}
                    sx={{ marginLeft: 2 }}
                >
                    Last Snipe Token
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearLogs}
                    sx={{ marginLeft: 2 }}
                >
                    Clear Logs
                </Button>
            </Box>
            <Box>
                <SniperBotDescription />
            </Box>
        </Box>
    );
};

export default LogsComponent;
