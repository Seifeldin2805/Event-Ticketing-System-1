import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../services/api';
import ProtectedRoute from '../../components/ProtectedRoute';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getAllEventsAdmin();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventApi.deleteEvent(eventId);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await eventApi.updateEvent(selectedEvent._id, selectedEvent);
      setOpenDialog(false);
      fetchEvents();
    } catch (err) {
      setError('Failed to update event');
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
        Manage Events
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Organizer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Tickets</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.organizer.name}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>${event.price}</TableCell>
                <TableCell>
                  {event.availableTickets} / {event.totalTickets}
                </TableCell>
                <TableCell>{event.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditEvent(event)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={selectedEvent?.title || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={selectedEvent?.description || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Date"
            type="datetime-local"
            value={selectedEvent?.date ? new Date(selectedEvent.date).toISOString().slice(0, 16) : ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Location"
            value={selectedEvent?.location || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={selectedEvent?.price || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, price: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category"
            value={selectedEvent?.category || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, category: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Total Tickets"
            type="number"
            value={selectedEvent?.totalTickets || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, totalTickets: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={selectedEvent?.status || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, status: e.target.value })}
            margin="normal"
            required
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="declined">Declined</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateEvent} variant="contained" color="primary">
            Update Event
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default function ProtectedAdminEvents() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminEvents />
    </ProtectedRoute>
  );
} 