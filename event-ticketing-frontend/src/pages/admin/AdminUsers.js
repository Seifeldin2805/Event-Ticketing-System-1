import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { userApi } from '../../services/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import UserRow from './UserRow';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      await userApi.updateUserRole(selectedUser._id, selectedUser.role);
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
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
        Manage Users
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={selectedUser?.name || ''}
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Email"
            value={selectedUser?.email || ''}
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={selectedUser?.role || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            margin="normal"
            required
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="organizer">Organizer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained" color="primary">
            Update User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default function ProtectedAdminUsers() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminUsers />
    </ProtectedRoute>
  );
} 