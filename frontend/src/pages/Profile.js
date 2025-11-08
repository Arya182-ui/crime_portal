import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Alert, Avatar, Divider, Grid, IconButton, Chip, Paper,
  Stack, Skeleton
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Verified as VerifiedIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createApiClient } from '../services/api';
import { getAuth } from 'firebase/auth';

export default function Profile() {
  const { idToken, user } = useAuth();
  const [profile, setProfile] = useState({ 
    name: user?.displayName || '', 
    email: user?.email || '', 
    photoURL: user?.photoURL || '',
    role: '' 
  });
  const [currentRole, setCurrentRole] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialProfile, setInitialProfile] = useState({});

  useEffect(() => {
    if (idToken) {
      loadProfile();
    }
  }, [idToken]);

  useEffect(() => {
    if (user) {
      const profileData = {
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
      };
      setProfile(profileData);
      setInitialProfile(profileData);
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const api = createApiClient(idToken);
      const response = await api.get('/auth/me');
      
      // Backend now returns: { uid, role, status, name, email }
      const { role, status, name, email } = response.data;
      
      setCurrentRole(role || 'No role set');
      
      // Update profile with backend data if available
      if (name || email) {
        setProfile(prev => ({
          ...prev,
          ...(name && { name }),
          ...(email && { email })
        }));
      }
      
      console.log('✅ Profile loaded:', { role, status, name, email });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSave = async () => {
    if (!idToken) {
      setMessage({ type: 'error', text: 'Not authenticated' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const api = createApiClient(idToken);
      const response = await api.post('/auth/profile', {
        name: profile.name,
        email: profile.email,
        photoURL: profile.photoURL,
        role: profile.role || 'OFFICER'
      });
      
      // Reload Firebase user to get updated profile
      const auth = getAuth();
      if (auth.currentUser) {
        await auth.currentUser.reload();
        
        // Update local state with fresh Firebase data
        const updatedProfileData = {
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
          photoURL: auth.currentUser.photoURL || '',
        };
        setProfile(updatedProfileData);
        setInitialProfile(updatedProfileData);
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully! Changes are now saved.' });
      setIsEditing(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
    setMessage(null);
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'error';
      case 'OFFICER': return 'primary';
      case 'USER': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account information and settings
        </Typography>
      </Box>

      {/* Alert Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Alert 
            severity={message.type} 
            sx={{ mb: 3 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        </motion.div>
      )}
      
      <Grid container spacing={3}>
        {/* Profile Card - Left Side */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              elevation={3}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                {/* Avatar with hover effect */}
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar 
                    src={profile.photoURL} 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto',
                      border: '4px solid white',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    {user?.email?.[0]?.toUpperCase()}
                  </Avatar>
                  {user?.emailVerified && (
                    <VerifiedIcon 
                      sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'success.main',
                        borderRadius: '50%',
                        p: 0.5,
                        fontSize: 32
                      }} 
                    />
                  )}
                </Box>

                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {profile.name || user?.displayName || 'User'}
                </Typography>
                
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {user?.email}
                </Typography>

                {/* Role Badge */}
                <Chip 
                  label={currentRole || 'Loading...'}
                  color={getRoleBadgeColor(currentRole)}
                  icon={<BadgeIcon />}
                  sx={{ 
                    fontWeight: 600,
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </CardContent>
            </Card>

            {/* Info Cards */}
            <Card elevation={2} sx={{ mt: 3 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" /> User ID
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-all', mt: 0.5 }}>
                      {user?.uid}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={1}>
                      <EmailIcon fontSize="small" /> Email Status
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                      {user?.emailVerified ? (
                        <Chip 
                          label="Verified" 
                          size="small" 
                          color="success" 
                          icon={<VerifiedIcon />}
                        />
                      ) : (
                        <Chip 
                          label="Not Verified" 
                          size="small" 
                          color="warning"
                        />
                      )}
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Account Created
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                      {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Edit Profile Card - Right Side */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                {/* Card Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Profile Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                    </Stack>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Form Fields */}
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    value={profile.email}
                    disabled
                    helperText="Email address cannot be changed"
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Profile Photo URL"
                    value={profile.photoURL}
                    onChange={(e) => setProfile({ ...profile, photoURL: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    helperText="Enter a URL for your profile photo"
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhotoCameraIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />

                  {/* Role Information Card */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'action.hover',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <BadgeIcon color="primary" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Current Role
                        </Typography>
                        <Chip 
                          label={currentRole || 'Not Assigned'} 
                          size="small"
                          color={getRoleBadgeColor(currentRole)}
                        />
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                          Your role is managed by the system administrator. Contact admin for role changes.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>

                {/* Additional Info */}
                <Box sx={{ mt: 4, p: 2, bgcolor: 'info.main', borderRadius: 1, color: 'info.contrastText' }}>
                  <Typography variant="body2" fontWeight={500}>
                    💡 Pro Tip
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.9 }}>
                    Keep your profile information up to date for better collaboration and communication with your team.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
