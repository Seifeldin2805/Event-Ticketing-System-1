import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { eventApi } from '../services/api';
import { toast } from 'react-toastify';
import EventCard from '../components/EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const loginToastShown = useRef(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Refresh events when component comes into focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      fetchEvents();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventApi.getAllEvents();
      console.log('Fetched events:', response.data);
      const eventsData = response.data || [];
      setEvents(eventsData);
      if (eventsData.length === 0) {
        setError('No events available');
      } else {
        setError(''); // Clear error if we have events
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events: ' + (err.response?.data?.message || err.message));
      setEvents([]); // Clear events on error
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase());
    // Normalize both filter and event category to lowercase for comparison
    const eventCategory = event.category ? event.category.toLowerCase().trim() : '';
    const filterCategory = filters.category ? filters.category.toLowerCase().trim() : '';
    const matchesCategory = !filterCategory || eventCategory === filterCategory;
    const matchesDate = !filters.date || new Date(event.date).toDateString() === new Date(filters.date).toDateString();
    return matchesSearch && matchesCategory && matchesDate;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            color: '#ffffff',
          }}
        >
          Discover Amazing Events
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Find and book tickets for your favorite events
        </Typography>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Events"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="music">Music</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
              <MenuItem value="arts">Arts</MenuItem>
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="business">Business</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </Typography>
        <Button 
          variant="outlined" 
          onClick={fetchEvents}
          sx={{ minWidth: 120 }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      {filteredEvents.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {events.length === 0 
              ? "There are no events available at the moment. Check back later!" 
              : "No events match your search criteria. Try adjusting your filters."}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <EventCard event={event} onViewDetails={() => navigate(`/events/${event._id}`)} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Events; 