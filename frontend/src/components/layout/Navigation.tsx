import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Container,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  FlightTakeoff,
  WbSunny,
  Place,
  Person,
  Logout,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  userProfile?: {
    name: string;
    email: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated,
  onLogout,
  userProfile,
}) => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem>
          <Typography variant="h6" sx={{ p: 2 }}>
            Smart Travel Planner
          </Typography>
        </ListItem>
        <Divider />
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemIcon>
            <FlightTakeoff />
          </ListItemIcon>
          <ListItemText primary="My Trips" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/weather')}>
          <ListItemIcon>
            <WbSunny />
          </ListItemIcon>
          <ListItemText primary="Weather" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/places')}>
          <ListItemIcon>
            <Place />
          </ListItemIcon>
          <ListItemText primary="Places" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation('/trips/new')}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Create New Trip" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <FlightTakeoff sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Smart Travel Planner
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
              <Button
                onClick={() => handleNavigation('/dashboard')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                My Trips
              </Button>
              <Button
                onClick={() => handleNavigation('/weather')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Weather
              </Button>
              <Button
                onClick={() => handleNavigation('/places')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Places
              </Button>
            </Box>

            {isAuthenticated ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={userProfile?.name || 'User'}>
                      {userProfile?.name?.[0] || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={onLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Button
                  onClick={() => handleNavigation('/login')}
                  sx={{ color: 'white' }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => handleNavigation('/register')}
                  sx={{ color: 'white' }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Add toolbar spacing */}
      <Toolbar />
    </>
  );
};

export default Navigation;
