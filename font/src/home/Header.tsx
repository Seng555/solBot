import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Drawer, List, ListItem, ListItemText, useMediaQuery, ListItemIcon } from '@mui/material';
import { ContactSupport, Menu } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Header: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bgColor, setBgColor] = useState('#ff647d'); // Initial background color

  const [price, setPrice] = useState(0);

  // State for the live online users count
  const [onlineUsers] = useState(Math.floor(Math.random() * (500 - 300 + 1)) + 300);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgColor((prevColor) =>
        prevColor === '#ff647d' ? '#e03d56' : '#ff647d'
      );
    }, 1000); // Change color every 1000 milliseconds (1 second)
    // Binance WebSocket URL for SOL/USDT
    const wsUrl = 'wss://stream.binance.com:9443/ws/solusdt@trade';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to Binance WebSocket for SOL/USDT');
    };

    ws.onmessage = (event) => {
      const tradeData = JSON.parse(event.data);

      // Extracting price from the trade data
      const currentPrice = parseFloat(tradeData.p);
      setPrice(currentPrice);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };
    return () => {
      clearInterval(intervalId);
      ws.close();
    } // Cleanup on unmount
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Responsive Logo and Title Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: isSmallScreen ? 'center' : 'flex-start',
          }}
        >
          {/* Logo Image */}
          <Box component="img" src="https://sniper.smithii.io/assets/img/logo.svg" alt="Logo" sx={{ height: 40, mr: isSmallScreen ? 0 : 1 }} />

          {/* Divider and Title (show only on larger screens) */}
          {!isSmallScreen && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Typography variant="h6" sx={{ mx: 1, color: 'inherit' }}>
                |
              </Typography>
              <Typography variant="h6">Solana Sniper Bot</Typography>
            </Box>
          )}
        </Box>

        {/* Navigation Links for mobile */}
        {isSmallScreen ? (
          <>
            <IconButton color="inherit" edge="end" aria-label="menu" onClick={toggleDrawer(true)}>
              <Menu />
            </IconButton>
            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
              <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                <List>
                  {/* Support Link */}
                  <ListItem component="a" target="_blank" href="https://t.me/web3prodev">
                    <ListItemIcon>
                      <ContactSupport sx={{ color: 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Contact support" />
                  </ListItem>

                  {/* Online Users */}
                  <ListItem>
                    <Button
                      fullWidth
                      color="inherit"
                      sx={{
                        fontWeight: 700,
                        fontSize: 16,
                        backgroundColor: bgColor,
                        '&:hover': {
                          backgroundColor: '#e03d56',
                        },
                        transition: 'all 0.3s ease-in-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          animation: 'fadeIn 2s ease-in-out infinite',
                        }}
                      >
                        Online Users: {onlineUsers}
                      </Typography>
                    </Button>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              sx={{
                fontWeight: 700,
                fontSize: 16,
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {/* Solana Icon */}
              <Box
                component="img"
                src="https://cryptologos.cc/logos/solana-sol-logo.png?v=035"
                alt="Solana Logo"
                sx={{
                  width: 20,
                  height: 20,
                  objectFit: 'contain',
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 700,
                  animation: 'fadeIn 2s ease-in-out infinite',
                }}
              >
                ${price}
              </Typography>
            </Button>
            {/* Support Button */}
            <a
              href="https://t.me/web3prodev"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none', // Remove underline from the link
              }}
            >
              <Button
                color="inherit"
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  '&:hover': {
                    backgroundColor: '#e03d56',
                  },
                  transition: 'all 0.3s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ContactSupport sx={{ color: 'white', fontSize: 18 }} /> {/* Icon inside button */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 700,
                    animation: 'fadeIn 2s ease-in-out infinite',
                  }}
                >
                  Support
                </Typography>
              </Button>
            </a>

            {/* Online Users Display with live updates */}
            <Button
              color="inherit"
              sx={{
                fontWeight: 700,
                fontSize: 16,
                backgroundColor: bgColor,
                '&:hover': {
                  backgroundColor: '#e03d56',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 700,
                  animation: 'fadeIn 2s ease-in-out infinite',
                }}
              >
                Online Users: {onlineUsers}
              </Typography>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
