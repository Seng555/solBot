import React, { useState } from 'react';
import { Box, Typography, Collapse, Button, Divider, FormControl, InputLabel, OutlinedInput, InputAdornment, Switch, Checkbox } from '@mui/material';
import { ExpandMore, ExpandLess, Key, PercentOutlined } from '@mui/icons-material';
import { Settings, useSettings } from '../../Context/SettingsContext';

const label = { inputProps: { 'aria-label': 'Switch' } };

const SettingComWallet: React.FC = () => {
    const [walletOpen, setWalletOpen] = useState(false);
    const [buyOpen, setBuyOpen] = useState(false);
    const [sellOpen, setSellOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const { settings, setSettings } = useSettings();

    const toggleSection = (section: string) => {
        setWalletOpen(section === 'wallet' ? !walletOpen : false);
        setBuyOpen(section === 'buy' ? !buyOpen : false);
        setSellOpen(section === 'sell' ? !sellOpen : false);
        setFilterOpen(section === 'filter' ? !filterOpen : false);
    };

    const handleInputChange = (field: keyof Settings, value: any) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [field]: value
        }));
    };

    return (
        <Box width="100%">
            {/** Wallet Setting */}
            <Box width="100%">
                <Button
                    variant="text"
                    endIcon={walletOpen ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => toggleSection('wallet')}
                    fullWidth
                    sx={{ justifyContent: 'space-between', fontWeight: 700 }}
                >
                    Wallet Setting
                </Button>
                <Collapse in={walletOpen} unmountOnExit>
                    <Box padding={2} width="95%">
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">*Private Key</InputLabel>
                            <OutlinedInput
                                value={settings.private_key}
                                required
                                onChange={(e) => handleInputChange('private_key', e.target.value)}
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start"><Key /></InputAdornment>}
                                label="*Private Key"
                                placeholder='e.g. a4c3f7e9e7c68b...'
                                size="small"
                            />
                        </FormControl>
                        <Typography mt={2} variant="body2">
                            We do not store or misuse your wallet. However, we suggest you create a new wallet and periodically transfer profits to your main wallet.
                        </Typography>
                    </Box>
                </Collapse>
                <Divider sx={{ my: 2 }} />
            </Box>

            {/** Buy Setting */}
            <Box width="100%">
                <Button
                    variant="text"
                    endIcon={buyOpen ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => toggleSection('buy')}
                    fullWidth
                    sx={{ justifyContent: 'space-between', fontWeight: 700 }}
                >
                    Buy Setting
                </Button>
                <Collapse in={buyOpen} unmountOnExit>
                    <Box padding={2} width="95%">
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" fontWeight={700} fontSize={'1rem'}>
                                Use our Premium Endpoint (Fee: 0.05 SOL)
                            </Typography>
                            <Switch
                                {...label}
                                checked={settings.usepremium}
                                onChange={(e) => handleInputChange('usepremium', e.target.checked)}
                            />
                        </Box>
                        <Typography variant="body2" fontSize={'0.8rem'} sx={{ color: "gray" }}>
                            We provide a private RPC that outperforms 95% of RPCs available in the market.
                        </Typography>

                        <Typography variant="body2" fontSize={'0.8rem'} sx={{ color: "gray", mt: 2 }}>
                            The fee used per transaction will be around 0.006 SOL to ensure they are executed in the fast way a sniper needs
                        </Typography>
                        <InputLabel sx={{ mt: 2, fontWeight: 700 }} htmlFor="outlined-adornment-amount">
                            Buying Amount:
                        </InputLabel>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <OutlinedInput
                                value={settings.bamount}
                                required
                                onChange={(e) => handleInputChange('bamount', e.target.value)}
                                id="outlined-adornment-amount"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Box
                                            component="img"
                                            src="https://cryptologos.cc/logos/solana-sol-logo.png?v=035"
                                            alt="Solana Logo"
                                            sx={{ width: 20, height: 20, objectFit: 'contain' }}
                                        />
                                    </InputAdornment>
                                }
                                size="small"
                            />
                        </FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount" sx={{ fontWeight: 700 }}>
                            Buy Slippage:
                        </InputLabel>
                        <FormControl fullWidth sx={{ m: 1, mt: 1 }}>
                            <OutlinedInput
                                required
                                id="outlined-adornment-amount"
                                value={settings.bslippage}
                                onChange={(e) => handleInputChange('bslippage', e.target.value)}
                                startAdornment={<InputAdornment position="start"><PercentOutlined /></InputAdornment>}
                                size="small"
                            />
                        </FormControl>
                    </Box>
                </Collapse>
                <Divider sx={{ my: 2 }} />
            </Box>

            {/** Sell Setting */}
            <Box width="100%">
                <Button
                    variant="text"
                    endIcon={sellOpen ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => toggleSection('sell')}
                    fullWidth
                    sx={{ justifyContent: 'space-between', fontWeight: 700 }}
                >
                    Sell Setting
                </Button>
                <Collapse in={sellOpen} unmountOnExit>
                    <Box padding={2} width="95%">
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" fontWeight={700}>
                                Auto-Sell Tokens
                            </Typography>
                            <Switch
                                {...label}
                                checked={settings.autosell}
                                onChange={(e) => handleInputChange('autosell', e.target.checked)}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            This enables automatic selling of tokens. If you want to manually sell bought tokens, disable this option.
                        </Typography>
                        <InputLabel sx={{ mt: 1, fontWeight: 700 }}>Take Profit:</InputLabel>
                        <FormControl fullWidth sx={{ m: 1, mt: 1 }}>
                            <OutlinedInput
                                required
                                id="outlined-adornment-amount"
                                value={settings.tp}
                                onChange={(e) => handleInputChange('tp', e.target.value)}
                                startAdornment={<InputAdornment position="start"><PercentOutlined /></InputAdornment>}
                                size="small"
                            />
                        </FormControl>
                        <InputLabel sx={{ mt: 1, fontWeight: 700 }}>Stop Loss:</InputLabel>
                        <FormControl fullWidth sx={{ m: 1, mt: 1 }}>
                            <OutlinedInput
                                required
                                id="outlined-adornment-amount"
                                value={settings.sl}
                                onChange={(e) => handleInputChange('sl', e.target.value)}
                                startAdornment={<InputAdornment position="start"><PercentOutlined /></InputAdornment>}
                                size="small"
                            />
                        </FormControl>
                        <InputLabel sx={{ mt: 1, fontWeight: 700 }}>Sell Slippage:</InputLabel>
                        <FormControl fullWidth sx={{ m: 1, mt: 1 }}>
                            <OutlinedInput
                                required
                                id="outlined-adornment-amount"
                                value={settings.sslippage}
                                onChange={(e) => handleInputChange('sslippage', e.target.value)}
                                startAdornment={<InputAdornment position="start"><PercentOutlined /></InputAdornment>}
                                size="small"
                            />
                        </FormControl>
                    </Box>
                </Collapse>
                <Divider sx={{ my: 2 }} />
            </Box>

            {/** Filter Setting */}
            <Box width="100%">
                <Button
                    variant="text"
                    endIcon={filterOpen ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => toggleSection('filter')}
                    fullWidth
                    sx={{ justifyContent: 'space-between', fontWeight: 700 }}
                >
                    Filter Setting
                </Button>
                <Collapse in={filterOpen} unmountOnExit>
                    <Box padding={2} width="95%">
                        <Typography variant="body1" fontWeight={700} sx={{ color: 'gray' }}>
                            * These filter settings help fine-tune the criteria for your bot.
                        </Typography>
                        <Box display="flex" flexDirection="column" mt={1}>
                            <InputLabel htmlFor="outlined-adornment-amount" sx={{ fontWeight: 700 }}>Max Dev Hold:</InputLabel>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <OutlinedInput
                                    value={settings.maxdevhold}
                                    required
                                    onChange={(e) => handleInputChange('maxdevhold', e.target.value)}
                                    id="outlined-adornment-amount"
                                    size="small"
                                />
                            </FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount" sx={{ fontWeight: 700 }}>Min Pool Amount:</InputLabel>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <OutlinedInput
                                    value={settings.minipool}
                                    required
                                    onChange={(e) => handleInputChange('minipool', e.target.value)}
                                    id="outlined-adornment-amount"
                                    size="small"
                                />
                            </FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount" sx={{ fontWeight: 700 }}>Max Pool Amount:</InputLabel>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <OutlinedInput
                                    value={settings.maxpool}
                                    required
                                    onChange={(e) => handleInputChange('maxpool', e.target.value)}
                                    id="outlined-adornment-amount"
                                    size="small"
                                />
                            </FormControl>
                        </Box>
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={2}>
                            <Typography variant="h6" fontWeight={700}>
                                Freezable Tokens
                            </Typography>
                            <Checkbox
                                checked={settings.freezable}
                                onChange={(e) => handleInputChange('freezable', e.target.checked)}
                            />
                        </Box>
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={1}>
                            <Typography variant="h6" fontWeight={700}>
                                Immutable Tokens
                            </Typography>
                            <Checkbox
                                checked={settings.immutable}
                                onChange={(e) => handleInputChange('immutable', e.target.checked)}
                            />
                        </Box>
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={1}>
                            <Typography variant="h6" fontWeight={700}>
                                LP Burned Tokens
                            </Typography>
                            <Checkbox
                                checked={settings.lpBurned}
                                onChange={(e) => handleInputChange('lpBurned', e.target.checked)}
                            />
                        </Box>
                    </Box>
                </Collapse>
            </Box>
        </Box>
    );
};

export default SettingComWallet;
