import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyBookings from './pages/MyBookings';
import MyEvents from './pages/MyEvents';
import AdminEvents from './pages/admin/AdminEvents';
import AdminUsers from './pages/admin/AdminUsers';
import Profile from './pages/Profile';
import EventAnalytics from './pages/EventAnalytics';
import Footer from './components/Footer';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a Spotify-like dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1db954', // Spotify green
      light: '#1ed760',
      dark: '#1aa34a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b6b', // Vibrant accent
      light: '#ff8787',
      dark: '#ff5252',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212', // Spotify's main dark background
      paper: '#181818', // Card background (slightly lighter)
    },
    text: {
      primary: '#ffffff', // Pure white for primary text
      secondary: '#b3b3b3', // Spotify's secondary text color
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#181818',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#282828',
            transform: 'translateY(-2px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        elevation3: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '10px 24px',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        contained: {
          backgroundColor: '#1db954',
          color: '#000',
          '&:hover': {
            backgroundColor: '#1ed760',
            boxShadow: '0 4px 12px rgba(29, 185, 84, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#1db954',
            backgroundColor: 'rgba(29, 185, 84, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 4,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: '#1db954',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1db954',
              borderWidth: 2,
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#b3b3b3',
            '&.Mui-focused': {
              color: '#1db954',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          backgroundImage: 'none',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#181818',
          borderRadius: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(29, 185, 84, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(29, 185, 84, 0.3)',
            },
          },
        },
      },
    },
  },
});

function EventsRouteGuard({ children }) {
  const { user } = useAuth();
  if (user && user.role === 'organizer') {
    return <Navigate to="/my-events" replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <EventsRouteGuard>
                  <Events />
                </EventsRouteGuard>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/event-analytics/:id" element={<EventAnalytics />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/events"
              element={
                <EventsRouteGuard>
                  <Events />
                </EventsRouteGuard>
              }
            />
          </Routes>
          <Footer />
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop 
            closeOnClick 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover
            theme="dark"
            toastStyle={{
              backgroundColor: '#1e293b',
              color: '#f1f5f9',
            }}
          />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
