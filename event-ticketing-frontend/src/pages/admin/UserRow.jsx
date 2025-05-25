import React from 'react';
import { TableRow, TableCell, Button } from '@mui/material';

const UserRow = ({ user, onEdit, onDelete }) => (
  <TableRow>
    <TableCell>{user.name}</TableCell>
    <TableCell>{user.email}</TableCell>
    <TableCell>{user.role}</TableCell>
    <TableCell>
      <Button
        size="small"
        color="primary"
        onClick={() => onEdit(user)}
        sx={{ mr: 1 }}
      >
        Edit
      </Button>
      <Button
        size="small"
        color="error"
        onClick={() => onDelete(user._id)}
      >
        Delete
      </Button>
    </TableCell>
  </TableRow>
);

export default UserRow; 