import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip, Avatar,
  Alert, Stack, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createApiClient } from '../services/api';

export default function Users() {
  const { idToken, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    photoURL: '',
    role: 'OFFICER',
    disabled: false
  });

  useEffect(() => {
    if (idToken && userRole === 'ADMIN') {
      loadUsers();
    }
  }, [idToken, userRole]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const api = createApiClient(idToken);
      const response = await api.get('/auth/users');
      setUsers(response.data.users);
      setMessage(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email || '',
        password: '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: user.role || 'OFFICER',
        disabled: user.disabled || false
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        displayName: '',
        photoURL: '',
        role: 'OFFICER',
        disabled: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      displayName: '',
      photoURL: '',
      role: 'OFFICER',
      disabled: false
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const api = createApiClient(idToken);
      
      if (editingUser) {
        // Update existing user
        await api.put(`/auth/users/${editingUser.uid}`, {
          displayName: formData.displayName,
          photoURL: formData.photoURL,
          role: formData.role,
          disabled: formData.disabled
        });
        setMessage({ type: 'success', text: 'User updated successfully!' });
      } else {
        // Create new user
        await api.post('/auth/users', formData);
        setMessage({ type: 'success', text: 'User created successfully!' });
      }
      
      handleCloseDialog();
      loadUsers();
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uid, email) => {
    if (!window.confirm(`Are you sure you want to delete user: ${email}?`)) {
      return;
    }

    setLoading(true);
    try {
      const api = createApiClient(idToken);
      await api.delete(`/auth/users/${uid}`);
      setMessage({ type: 'success', text: 'User deleted successfully!' });
      loadUsers();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete user' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: { color: 'error', icon: <AdminIcon /> },
      OFFICER: { color: 'primary', icon: <SecurityIcon /> },
      USER: { color: 'default', icon: <PersonIcon /> }
    };
    const config = roleConfig[role] || roleConfig.USER;
    return <Chip label={role || 'No Role'} color={config.color} size="small" icon={config.icon} />;
  };

  if (userRole !== 'ADMIN') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <AdminIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          Admin Access Required
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You need administrator privileges to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage officers and system users
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Stack>
      </Box>

      {/* Alert Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        </motion.div>
      )}

      {/* Users Table */}
      <Card elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.uid} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={user.photoURL} sx={{ width: 40, height: 40 }}>
                          {user.email?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.displayName || 'No Name'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.uid}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                      {user.emailVerified && (
                        <Chip label="Verified" size="small" color="success" sx={{ mt: 0.5 }} />
                      )}
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.disabled ? (
                        <Chip label="Disabled" size="small" color="error" />
                      ) : (
                        <Chip label="Active" size="small" color="success" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {user.creationTimestamp
                          ? new Date(user.creationTimestamp).toLocaleDateString()
                          : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(user.uid, user.email)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={editingUser !== null}
              required
            />
            
            {!editingUser && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                helperText="Minimum 6 characters"
                required
              />
            )}
            
            <TextField
              fullWidth
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="Photo URL"
              value={formData.photoURL}
              onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
            
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="OFFICER">Officer</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            
            {editingUser && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.disabled}
                    onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                  />
                }
                label="Disable Account"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || (!editingUser && (!formData.email || !formData.password))}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
