import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, to: '/' },
    { text: 'Calendar', icon: <CalendarMonthIcon />, to: '/calendar' },
    { text: 'New Event', icon: <AddIcon />, to: '/event/new' },
  ];

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          boxShadow: 'none',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: { xs: 1, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'cursive',
                fontWeight: 700,
                color: '#027ef7',
                letterSpacing: 1,
                userSelect: 'none',
              }}
            >
              Complete Event
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                gap: 8, 
                justifyContent: 'center',
              }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.to}
                  startIcon={item.icon}
                  sx={{
                    color: '#181828',
                    fontWeight: 600,
                    fontSize: 16,
                    textTransform: 'none',
                    px: 1,
                    '&:hover': { color: '#4b9ff2', bgcolor: 'transparent' },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flex: 1 }} />

          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{ color: '#181828' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={RouterLink} to={item.to}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
