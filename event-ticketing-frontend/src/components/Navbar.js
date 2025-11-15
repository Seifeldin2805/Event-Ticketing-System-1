import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ py: 1 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 700,
            color: '#1db954',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#1ed760',
              transform: 'scale(1.02)',
            }
          }} 
          onClick={() => navigate('/')}
        >
          🎫 EventTicketing
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!user ? (
            <>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              {((user.role === 'user') || (user.role === 'admin')) && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/')}
                >
                  Events
                </Button>
              )}
              {user.role === 'user' && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/bookings')}
                >
                  My Bookings
                </Button>
              )}
              {user.role === 'organizer' && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/my-events')}
                >
                  My Events
                </Button>
              )}
              {user.role === 'admin' && (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/admin/events')}
                  >
                    Manage Events
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/admin/users')}
                  >
                    Manage Users
                  </Button>
                </>
              )}

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 