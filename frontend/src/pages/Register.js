import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [emailSendWarning, setEmailSendWarning] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z\d]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength();
  const passwordMatch = password && confirm && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    const auth = getAuth();
    try {
      // Step 1: Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential.user.uid);
      
      const token = await userCredential.user.getIdToken();
      console.log('Token obtained successfully');
      
      // Step 2: Create profile in backend
      try {
        const response = await axios.post(
          (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/auth/profile',
          { name, email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Profile created successfully:', response.data);
      } catch (profileErr) {
        console.error('Profile creation error:', profileErr.response?.status, profileErr.response?.data);
        // Continue - profile will be created on first login if it fails here
      }
      
      // Step 3: Send email verification (don't block on failure)
      let emailSent = false;
      try {
        await sendEmailVerification(userCredential.user);
        console.log('Verification email sent successfully to:', email);
        emailSent = true;
      } catch (emailErr) {
        console.error('Email verification error:', emailErr.code, emailErr.message);
        setEmailSendWarning(true);   
      }
      
      setSuccess(true);
      setError(null);
      
      // Navigate to login after showing success message
      setTimeout(() => {
        navigate('/login');
      }, emailSent ? 3000 : 5000); // More time if email warning shown
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed';
      
      // Handle Firebase authentication errors
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication error. Please try logging in.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px - 80px)', // Subtract header and footer heights
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4, // Add vertical padding
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        },
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 5,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.9)'
                  : 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    mb: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="Crime Portal Logo"
                    sx={{
                      height: 48,
                      width: 48,
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1)', // Make logo white
                    }}
                  />
                </Box>
              </motion.div>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join Crime Portal - Secure Access
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                autoComplete="name"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Email Address"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                autoComplete="email"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                autoComplete="new-password"
                variant="outlined"
                required
                helperText={
                  password ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        sx={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          bgcolor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            bgcolor:
                              passwordStrength < 50
                                ? 'error.main'
                                : passwordStrength < 75
                                ? 'warning.main'
                                : 'success.main',
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ minWidth: 60 }}>
                        {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                      </Typography>
                    </Box>
                  ) : (
                    'Minimum 6 characters'
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                margin="normal"
                autoComplete="new-password"
                variant="outlined"
                required
                error={confirm && !passwordMatch}
                helperText={
                  confirm ? (
                    passwordMatch ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                        Passwords match
                      </Box>
                    ) : (
                      'Passwords do not match'
                    )
                  ) : (
                    'Re-enter your password'
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !passwordMatch}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Already Have an Account? Sign In
              </Button>
            </form>

            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              display="block"
              sx={{ mt: 3 }}
            >
              By registering, you agree to our Terms of Service
            </Typography>
          </Paper>
        </motion.div>
      </Container>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={emailSendWarning ? 5000 : 3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" variant="filled" icon={<CheckCircleIcon />}>
          Account created successfully! {emailSendWarning ? 'You can log in now.' : 'Please check your email to verify your account before logging in.'}
        </Alert>
      </Snackbar>

      {/* Email Warning Snackbar */}
      <Snackbar
        open={emailSendWarning}
        autoHideDuration={6000}
        onClose={() => setEmailSendWarning(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setEmailSendWarning(false)} severity="warning" variant="filled">
          Note: Verification email could not be sent. You can resend it from the login page after entering your credentials.
        </Alert>
      </Snackbar>
    </Box>
  );
}
