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

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
