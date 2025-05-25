import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const EventCard = ({ event, onViewDetails }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardMedia
      component="img"
      height="200"
      image={event.image || 'https://via.placeholder.com/300x200'}
      alt={event.title}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="h2">
        {event.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {event.description.substring(0, 150)}...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Date: {new Date(event.date).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: ${event.price}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={onViewDetails}
      >
        View Details
      </Button>
    </CardContent>
  </Card>
);

export default EventCard; 