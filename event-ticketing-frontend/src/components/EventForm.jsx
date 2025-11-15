import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';

const categories = [
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts' },
  { value: 'food', label: 'Food' },
  { value: 'business', label: 'Business' },
];

const EventForm = ({ open, initialValues = {}, onSubmit, onCancel, submitLabel = 'Create Event' }) => {
  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    // If it's already in the correct format (YYYY-MM-DDTHH:mm), return as is
    if (typeof dateValue === 'string' && dateValue.includes('T')) {
      return dateValue.slice(0, 16);
    }
    // If it's a Date object or ISO string, convert it
    try {
      const date = new Date(dateValue);
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    date: formatDateForInput(initialValues.date),
    location: initialValues.location || '',
    price: initialValues.price || '',
    category: initialValues.category ? initialValues.category.toLowerCase() : '',
    totalTickets: initialValues.totalTickets || '',
    image: initialValues.image || '',
  });

  useEffect(() => {
    setForm({
      title: initialValues.title || '',
      description: initialValues.description || '',
      date: formatDateForInput(initialValues.date),
      location: initialValues.location || '',
      price: initialValues.price || '',
      category: initialValues.category ? initialValues.category.toLowerCase() : '',
      totalTickets: initialValues.totalTickets || '',
      image: initialValues.image || '',
    });
  }, [initialValues, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('EventForm submitting:', form);
    // Ensure image is included even if empty
    const formData = {
      ...form,
      image: form.image || '', // Ensure image is always a string
    };
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{submitLabel}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            multiline
            minRows={2}
            required
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Date & Time"
            name="date"
            value={form.date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            helperText="Select both date and time for your event"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            margin="normal"
            required
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Total Tickets"
            name="totalTickets"
            type="number"
            value={form.totalTickets}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
            margin="normal"
            helperText="Enter a URL for the event image (e.g., https://example.com/image.jpg)"
            placeholder="https://example.com/event-image.jpg"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm; 