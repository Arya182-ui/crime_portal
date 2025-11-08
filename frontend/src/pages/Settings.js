import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Button, Alert, Select, MenuItem, 
  FormControl, InputLabel, Stack, Avatar, Paper, Chip, Divider
} from '@mui/material';
import { 
  Settings as SettingsIcon, 
  Email as EmailIcon, 
  Fingerprint as FingerprintIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createApiClient } from '../services/api';

export default function Settings() {
  const { idToken, user, logout } = useAuth();
  const [role, setRole] = useState('ADMIN');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetRole = async () => {
    if (!idToken) {
      console.log('No token available');
      setMessage({ type: 'error', text: 'Not authenticated' });
      return;
    }

    console.log('Setting role with token:', idToken?.substring(0, 20) + '...');
    setLoading(true);
    setMessage(null);

    try {
      const api = createApiClient(idToken);
      console.log('API client created, making request...');
      const response = await api.post('/auth/set-my-role', { role });
      console.log('Response:', response.data);
      setMessage({ type: 'success', text: response.data.message });
      
      // Auto logout after 2 seconds
      setTimeout(async () => {
        await logout();
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Error setting role:', error);
      console.error('Error response:', error.response);
      setMessage({ type: 'error', text: error.response?.data?.error || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: 48,
              height: 48
            }}
          >
            <SettingsIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account preferences and security
            </Typography>
          </Box>
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* User Information Card */}
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Account Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Stack spacing={2}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <EmailIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user?.email}
                  </Typography>
                </Box>
              </Paper>

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <FingerprintIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight={500}
                    sx={{ 
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {user?.uid}
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </CardContent>
        </Card>

        {/* Role Management Card */}
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AdminIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Role Management
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your Firebase custom claims role. You will be logged out after setting the role.
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            {message && (
              <Alert 
                severity={message.type} 
                sx={{ mb: 3 }}
                variant="filled"
              >
                {message.text}
              </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Role</InputLabel>
              <Select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                label="Select Role"
                disabled={loading}
              >
                <MenuItem value="ADMIN">
                  <Chip label="ADMIN" color="error" size="small" sx={{ mr: 1 }} />
                  Full System Access
                </MenuItem>
                <MenuItem value="OFFICER">
                  <Chip label="OFFICER" color="warning" size="small" sx={{ mr: 1 }} />
                  Officer Privileges
                </MenuItem>
                <MenuItem value="USER">
                  <Chip label="USER" color="info" size="small" sx={{ mr: 1 }} />
                  Basic Access
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSetRole}
              disabled={loading}
              startIcon={<LogoutIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                },
                '&.Mui-disabled': {
                  background: 'rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              {loading ? 'Setting Role...' : 'Set Role and Logout'}
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
