import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { eventApi } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { toast } from 'react-toastify';
import EventForm from '../components/EventForm';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    category: '',
    totalTickets: '',
    image: '',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const loginToastShown = useRef(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getUserEvents();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      console.log('Creating event with data:', newEvent);
      await eventApi.createEvent(newEvent);
      setOpenDialog(false);
      fetchEvents();
      setNewEvent({
        title: '',
        description: '',
        date: '',
        location: '',
        price: '',
        category: '',
        totalTickets: '',
      });
    } catch (err) {
      setError('Failed to create event');
    }
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

  const handleEditClick = (event) => {
    setEditEvent({ ...event });
    setEditDialogOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditEvent({ ...editEvent, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      const eventToUpdate = { ...editEvent };
      delete eventToUpdate.status;
      await eventApi.updateEvent(editEvent._id, eventToUpdate);
      setEditDialogOpen(false);
      setEditEvent(null);
      fetchEvents();
    } catch (err) {
      setError('Failed to update event');
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditEvent(null);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Events
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create New Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {events.length === 0 ? (
        <Alert severity="info">
          You haven't created any events yet. Click the button above to create your first event!
        </Alert>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>${event.price}</TableCell>
                <TableCell>
                  <Chip 
                    label={event.status} 
                    color={
                      event.status === 'approved' ? 'success' : 
                      event.status === 'declined' ? 'error' : 
                      'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(event)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Delete Event
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => navigate(`/event-analytics/${event._id}`)}
                  >
                    Analytics
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EventForm
        open={openDialog}
        initialValues={newEvent}
        onSubmit={async (form) => {
          try {
            console.log('Creating event with form data:', form);
            const response = await eventApi.createEvent(form);
            console.log('Event created:', response.data);
            toast.success('Event created successfully!');
            setOpenDialog(false);
            fetchEvents();
            setNewEvent({
              title: '',
              description: '',
              date: '',
              location: '',
              price: '',
              category: '',
              totalTickets: '',
              image: '',
            });
          } catch (err) {
            console.error('Error creating event:', err);
            const errorMsg = err.response?.data?.message || 'Failed to create event';
            setError(errorMsg);
            toast.error(errorMsg);
          }
        }}
        onCancel={() => setOpenDialog(false)}
        submitLabel="Create Event"
      />

      <EventForm
        open={editDialogOpen}
        initialValues={editEvent || {}}
        onSubmit={async (form) => {
          try {
            const eventToUpdate = { ...form };
            delete eventToUpdate.status;
            await eventApi.updateEvent(editEvent._id, eventToUpdate);
            setEditDialogOpen(false);
            setEditEvent(null);
            fetchEvents();
          } catch (err) {
            setError('Failed to update event');
          }
        }}
        onCancel={handleEditCancel}
        submitLabel="Save Changes"
      />
    </Container>
  );
};

export default function ProtectedMyEvents() {
  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <MyEvents />
    </ProtectedRoute>
  );
}