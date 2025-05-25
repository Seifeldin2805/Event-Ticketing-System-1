import React from 'react';
import { Container, Typography } from '@mui/material';

const UnauthorizedPage = () => (
  <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant="h3" color="error" gutterBottom>
      403 - Unauthorized
    </Typography>
    <Typography variant="h6">
      You do not have permission to view this page.
    </Typography>
  </Container>
);

export default UnauthorizedPage; 