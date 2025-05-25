import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';

const categories = [
  { value: 'Music', label: 'Music' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Food', label: 'Food' },
  { value: 'Business', label: 'Business' },
];

const EventForm = ({ open, initialValues = {}, onSubmit, onCancel, submitLabel = 'Create Event' }) => {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    date: initialValues.date || '',
    location: initialValues.location || '',
    price: initialValues.price || '',
    category: initialValues.category || '',
    totalTickets: initialValues.totalTickets || '',
  });

  useEffect(() => {
    setForm({
      title: initialValues.title || '',
      description: initialValues.description || '',
      date: initialValues.date || '',
      location: initialValues.location || '',
      price: initialValues.price || '',
      category: initialValues.category || '',
      totalTickets: initialValues.totalTickets || '',
    });
  }, [initialValues, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
            type="date"
            label="Date"
            name="date"
            value={form.date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
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