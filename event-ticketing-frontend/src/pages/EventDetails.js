import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  MenuItem,
} from '@mui/material';
import { eventApi, bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventApi.getEvent(id);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= event.remainingTickets) {
      setTicketQuantity(value);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      await bookingApi.createBooking({
        eventId: id,
        quantity: ticketQuantity,
      });
      navigate('/bookings');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleEdit = () => {
    setEditedEvent({ ...event });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await eventApi.updateEvent(id, editedEvent);
      setEvent(editedEvent);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update event details');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Normalize category to lowercase if it's the category field
    const normalizedValue = name === 'category' && value ? value.toLowerCase() : value;
    setEditedEvent({ ...editedEvent, [name]: normalizedValue });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Event not found'}</Alert>
      </Container>
    );
  }

  const now = new Date();
  const eventDate = new Date(event.date);
  const endOfDay = new Date(eventDate);
  endOfDay.setHours(23, 59, 59, 999);
  const eventEnded = endOfDay < now;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {isEditing ? (
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={editedEvent.image || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                helperText="Enter a URL for the event image"
              />
            ) : (
              <img
                src={event.image || 'https://via.placeholder.com/800x400'}
                alt={event.title}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
            {isEditing ? (
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editedEvent.title}
                onChange={handleInputChange}
                sx={{ mb: 2, mt: 2 }}
              />
            ) : (
              <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
                {event.title}
              </Typography>
            )}
            {isEditing ? (
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editedEvent.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Date & Time
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    type="datetime-local"
                    name="date"
                    value={editedEvent.date ? new Date(editedEvent.date).toISOString().slice(0, 16) : ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <Typography variant="body1">
                    {new Date(event.date).toLocaleString()}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Location
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    name="location"
                    value={editedEvent.location}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography variant="body1">{event.location}</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Category
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    select
                    name="category"
                    value={editedEvent.category || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="music">Music</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
                    <MenuItem value="arts">Arts</MenuItem>
                    <MenuItem value="food">Food</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                  </TextField>
                ) : (
                  <Typography variant="body1">{event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'N/A'}</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Organizer
                </Typography>
                <Typography variant="body1">{event.organizer?.name || 'Organizer'}</Typography>
              </Grid>
            </Grid>
            {user && (user.id === event.organizer?._id || user.role === 'admin') && (
              <Box sx={{ mt: 2 }}>
                {isEditing ? (
                  <Box>
                    <Button 
                      variant="contained" 
                      onClick={handleSave} 
                      sx={{ 
                        mr: 1,
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={handleCancel}
                    sx={{
                    }}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button 
                    variant="contained" 
                    onClick={handleEdit}
                    sx={{
                    }}
                  >
                    Edit Event
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Book Tickets
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${event.price} per ticket
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Available Tickets: {event.remainingTickets}
            </Typography>

            {bookingError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {bookingError}
              </Alert>
            )}

            {eventEnded && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Sorry, the event has ended. No bookings available.
              </Alert>
            )}

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={ticketQuantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: event.remainingTickets }}
              sx={{ mb: 2 }}
              disabled={eventEnded}
            />

            <Typography variant="h6" gutterBottom>
              Total: ${(event.price * ticketQuantity).toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleBooking}
              disabled={!event.remainingTickets || eventEnded}
              sx={eventEnded ? { 
                backgroundColor: '#bdbdbd', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#9e9e9e',
                }
              } : {
              }}
            >
              {eventEnded ? 'Event Ended' : (!event.remainingTickets ? 'Sold Out' : 'Book Now')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetails; 