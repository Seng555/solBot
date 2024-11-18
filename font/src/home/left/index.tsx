import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Grid, IconButton, Typography } from '@mui/material';
import { PaidOutlined, PlayArrow, YouTube } from '@mui/icons-material';
import SettingComponent from './seting';
import { Telegram } from '@mui/icons-material';
import { useLogs } from '../../Context/LogsContext';
import socket from '../../socket/socket';

const Leftcomponent: React.FC = () => {
    const [starting, setStart] = useState(false);
    const { addLog } = useLogs(); // Access the logs state and methods
    const addLogs = async (mss: string) => addLog(mss);

    const start = async () => {
        try {
            setStart(true)
            addLogs("Bot started successfully!")
            socket.emit("start")
        } catch (error) {

        }
    }

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.on('smg', ({ msg, type }: { msg: string | object, type?: number }) => {
            console.log(type);

            // Check if msg is an object before using Object.entries
            if (typeof msg === 'object' && msg !== null) {
                // Iterate over the object and log each key-value pair
                Object.entries(msg).forEach(([key, value]) => {
                    addLog(`${key}: ${value}`);
                });
            } else if (typeof msg === 'string') {
                // If msg is a string, log it directly
                addLog(msg);
            }
        });
        return () => {
            socket.off('message');
        };
    }, []);
    return (
        <Grid item xs={12} md={4}>
            <Box sx={{ padding: 1 }}>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                        <PaidOutlined />
                        <Typography variant="h6" fontWeight={700}>
                            Solana Sniper Bot
                        </Typography>
                    </Box>
                    <Box>
                        <Button disabled={starting} variant="contained" endIcon={starting ? <CircularProgress size={20} color='warning' /> : <PlayArrow />} onClick={start}>
                            RUN SNIPER
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ mt: 5 }}>
                    To use the sniper, please wrap your SOL as we will be using
                    <Box sx={{ color: "#ff647d", fontWeight: 700 }} component={"a"} > wrapped SOL (wSOL) </Box> to purchase the tokens.
                </Box>
                <Box sx={{ mt: 2 }}>
                    The cost of running the bot is Free and 0.05 SOL for Use our Premium Endpoint.
                    Once you run it, the Sniper will look for new tokens
                    <Box sx={{ color: "black", fontWeight: 700 }} component={"span"} > under the settings you select below. </Box>
                    <Box sx={{ color: "black", fontWeight: 700 }} component={"span"} > The bot will run for 48 hours if you don't stop it. </Box>
                </Box>
                <Box alignItems="center" sx={{ ml: "40%" }}>
                    <Divider sx={{ mt: 2, width: 100 }} />
                </Box>
                <SettingComponent />
                <Box alignItems="center" sx={{ ml: "40%" }}>
                    <Divider sx={{ mt: 2, width: 100 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {/* Telegram Icon */}
                    <IconButton
                        href="https://t.me/web3prodev"
                        target="_blank"
                        color="primary"
                        sx={{
                            fontSize: 36, // Set the initial icon size
                            '&:hover': {
                                fontSize: 48, // Increase icon size on hover
                                color: 'blue', // Change color on hover
                            },
                        }}
                    >
                        <Telegram />
                    </IconButton>

                    {/* YouTube Icon */}
                    <IconButton
                        href="https://youtube.com/yourchannel"
                        target="_blank"
                        color="error"
                        sx={{
                            fontSize: 36, // Set the initial icon size
                            '&:hover': {
                                fontSize: 48, // Increase icon size on hover
                                color: 'red', // Change color on hover
                            },
                        }}
                    >
                        <YouTube />
                    </IconButton>
                </Box>
            </Box>
        </Grid>
    );
};

export default Leftcomponent;
