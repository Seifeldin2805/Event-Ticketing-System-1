import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => (
  <Box 
    sx={{ 
      mt: 8, 
      py: 4, 
      backgroundColor: '#000000',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
    }}
  >
    <Container maxWidth="lg">
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          mb: 1,
        }}
      >
        © {new Date().getFullYear()} EventTicketing. All rights reserved.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Link 
          href="mailto:contact@eventticketing.com" 
          color="inherit" 
          underline="hover"
          sx={{ 
            color: 'text.secondary',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: '#1db954',
            }
          }}
        >
          Contact Us
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>•</Typography>
        <Link 
          href="#" 
          color="inherit" 
          underline="hover"
          sx={{ 
            color: 'text.secondary',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: '#1db954',
            }
          }}
        >
          Privacy Policy
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>•</Typography>
        <Link 
          href="#" 
          color="inherit" 
          underline="hover"
          sx={{ 
            color: 'text.secondary',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: '#1db954',
            }
          }}
        >
          Terms of Service
        </Link>
      </Box>
    </Container>
  </Box>
);

export default Footer; 