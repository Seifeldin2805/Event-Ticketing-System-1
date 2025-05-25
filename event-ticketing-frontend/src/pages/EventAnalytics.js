import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventApi, bookingApi } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Box, CircularProgress, Paper, Alert, Divider } from '@mui/material';

const COLORS = ['#0088FE', '#FF8042'];

const EventAnalytics = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const fetchData = async () => {
    try {
      const eventRes = await eventApi.getEvent(id);
      setEvent(eventRes.data);
      // Fetch all bookings for this event (organizer endpoint returns all bookings, filter by event)
      const bookingsRes = await bookingApi.getOrganizerBookings();
      setBookings(bookingsRes.data.filter(b => {
        const eventId = b.event?._id || b.event?.id || b.event;
        return eventId === id;
      }));
    } catch (err) {
      setError('Failed to fetch event analytics');
    } finally {
      setLoading(false);
    }
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

  const totalBooked = bookings.reduce((sum, b) => sum + b.tickets, 0);
  const totalTickets = event.totalTickets;
  const data = [
    { name: 'Booked', value: totalBooked },
    { name: 'Available', value: Math.max(totalTickets - totalBooked, 0) },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {event.title} - Analytics
        </Typography>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Date & Time: {new Date(event.date).toLocaleString()}</Typography>
        <Typography variant="subtitle1">Location: {event.location}</Typography>
        <Typography variant="subtitle1">Category: {event.category}</Typography>
        <Typography variant="subtitle1">Price: ${event.price}</Typography>
        <Typography variant="subtitle1">Total Tickets: {event.totalTickets}</Typography>
        <Typography variant="subtitle1">Tickets Booked: {totalBooked}</Typography>
        <Typography variant="subtitle1">Tickets Remaining: {event.remainingTickets}</Typography>
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Booking Analytics</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default EventAnalytics; 