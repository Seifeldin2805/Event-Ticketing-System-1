import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingApi.getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            You haven't made any bookings yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/')}
          >
            Browse Events
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item key={booking._id} xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.event ? booking.event.title : "Event Deleted"}
                  </Typography>
                  {booking.event ? (
                    <>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Date: {new Date(booking.event.date).toLocaleDateString()}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="error">
                      This event no longer exists.
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {booking.tickets}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: ${booking.totalPrice}
                  </Typography>
                </CardContent>
                <CardActions>
                  {booking.event && (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/events/${booking.event._id}`)}
                    >
                      View Event
                    </Button>
                  )}
                  {booking.event && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default function ProtectedMyBookings() {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <MyBookings />
    </ProtectedRoute>
  );
} 