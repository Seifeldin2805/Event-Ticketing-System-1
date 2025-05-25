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

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getAllEvents();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
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
    const matchesCategory =
      !filters.category ||
      (event.category && event.category.toLowerCase() === filters.category.toLowerCase());
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

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
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