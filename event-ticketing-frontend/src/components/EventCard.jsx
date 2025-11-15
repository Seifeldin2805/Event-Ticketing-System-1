import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { CalendarToday, LocationOn, AttachMoney } from '@mui/icons-material';

const EventCard = ({ event, onViewDetails }) => (
  <Card 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: '#1db954',
        zIndex: 1,
      }
    }}
  >
    <CardMedia
      component="img"
      height="220"
      image={event.image || 'https://via.placeholder.com/300x200'}
      alt={event.title}
      sx={{
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        }
      }}
    />
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {event.category && (
        <Chip 
          label={event.category.charAt(0).toUpperCase() + event.category.slice(1)} 
          size="small" 
          sx={{ 
            mb: 1.5,
            alignSelf: 'flex-start',
            backgroundColor: '#1db954',
            color: '#000',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#1ed760',
            }
          }} 
        />
      )}
      <Typography 
        gutterBottom 
        variant="h6" 
        component="h2"
        sx={{ 
          fontWeight: 600,
          mb: 1.5,
          lineHeight: 1.3,
          minHeight: '3.2em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {event.title}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        paragraph
        sx={{ 
          flexGrow: 1,
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {event.description?.substring(0, 120)}...
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarToday sx={{ fontSize: 16, color: '#1db954' }} />
          <Typography variant="body2" color="text.secondary">
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
        {event.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16, color: '#ff6b6b' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {event.location}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AttachMoney sx={{ fontSize: 16, color: '#10b981' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            ${event.ticketPrice || event.price || '0'}
          </Typography>
        </Box>
      </Box>
      
      <Button
        variant="contained"
        fullWidth
        sx={{ 
          mt: 'auto',
          backgroundColor: '#1db954',
          color: '#000',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#1ed760',
            transform: 'scale(1.02)',
          },
          transition: 'all 0.2s ease',
        }}
        onClick={onViewDetails}
      >
        View Details
      </Button>
    </CardContent>
  </Card>
);

export default EventCard; 