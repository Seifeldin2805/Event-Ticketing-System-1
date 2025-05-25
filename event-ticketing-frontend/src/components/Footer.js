import { Box, Typography, Link } from '@mui/material';

const Footer = () => (
  <Box sx={{ mt: 8, py: 2, backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
    <Typography variant="body2">
      © {new Date().getFullYear()} Event Ticketing System. All rights reserved.
      &nbsp;|&nbsp;
      <Link href="mailto:contact@eventticketing.com" color="inherit" underline="always">
        Contact Us
      </Link>
    </Typography>
  </Box>
);

export default Footer; 