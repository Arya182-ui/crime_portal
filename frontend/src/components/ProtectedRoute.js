import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

export default function ProtectedRoute({ children }) {
  const { user, loading, profileError, userStatus, statusMessage, logout } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user status is PENDING or REJECTED
  if (userStatus === 'PENDING' || userStatus === 'REJECTED') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 3,
        p: 3,
        textAlign: 'center'
      }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: userStatus === 'PENDING' ? 'warning.light' : 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem'
          }}
        >
          {userStatus === 'PENDING' ? '⏳' : '❌'}
        </Box>
        <Typography variant="h4" fontWeight="bold">
          {userStatus === 'PENDING' ? 'Account Pending Approval' : 'Account Rejected'}
        </Typography>
        <Typography color="text.secondary" maxWidth="500px">
          {statusMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" maxWidth="500px">
          {userStatus === 'PENDING' 
            ? 'An administrator will review your account shortly. You will be able to access the system once approved.'
            : 'Please contact the administrator for more information.'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    );
  }
  
  if (profileError) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 2,
        p: 3
      }}>
        <Typography variant="h5" color="error">Profile Setup Error</Typography>
        <Typography color="text.secondary" align="center">
          There was an issue setting up your profile. Please try logging in again.
        </Typography>
        <Button variant="contained" onClick={logout}>
          Logout and Try Again
        </Button>
      </Box>
    );
  }
  
  return children;
}
