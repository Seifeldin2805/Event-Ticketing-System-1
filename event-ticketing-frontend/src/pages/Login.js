import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading, user } = useAuth();
  const [loginAttempted, setLoginAttempted] = useState(false);
  const prevUser = useRef(null);
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoginAttempted(true);
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  const handleForgotPassword = () => {
    setForgotDialogOpen(true);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotDialogOpen(false);
    setForgotEmail("");
    toast.info("A password reset link was sent to your email.");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Only show toast and navigate if login was attempted and user changed
    if (loginAttempted && user && prevUser.current !== user.email) {
      toast.success('Login successful!');
      prevUser.current = user.email;
      if (user.role === 'organizer') {
        navigate('/my-events', { replace: true });
      } else {
        navigate('/events', { replace: true });
      }
    }
  }, [loginAttempted, user, navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5,
            backgroundColor: '#181818',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 3,
              color: '#ffffff',
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={authLoading}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={authLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3,
                py: 1.5,
              }}
              disabled={authLoading}
            >
              {authLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <RouterLink 
                to="/register" 
                style={{ 
                  textDecoration: 'none',
                  color: '#1db954',
                  fontWeight: 600,
                }}
              >
                Create one here
              </RouterLink>
            </Typography>
            <Button 
              variant="text" 
              size="small" 
              onClick={handleForgotPassword} 
                sx={{ 
                mt: 2,
                color: 'text.secondary',
                '&:hover': {
                  color: '#1db954',
                }
              }}
            >
              Forgot Password?
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={forgotDialogOpen} onClose={() => setForgotDialogOpen(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <form onSubmit={handleForgotSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForgotDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Send Reset Link</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Login; 