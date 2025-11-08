import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import ShieldIcon from '@mui/icons-material/Shield';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useAuth } from '../context/AuthContext';
import pkg from '../../package.json';

export default function Footer(){
  const { user, userRole } = useAuth();
  const year = new Date().getFullYear();
  
  // Simple footer for unauthenticated users
  if (!user) {
    return (
      <Box 
        component="footer" 
        sx={{ 
          mt: 'auto',
          py: 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Crime Portal
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/documentation" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Docs
              </Link>
              <Link href="/privacy" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Privacy
              </Link>
              <Link href="/terms" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Terms
              </Link>
              <Link href="/support" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Support
              </Link>
              <Link href="/team" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Our Team
              </Link>
            </Box>
            <Typography variant="body2" color="text.secondary">
              © {year} Crime Portal. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'primary.main', color: 'white' }
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                sx={{ 
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'primary.main', color: 'white' }
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                sx={{ 
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'primary.main', color: 'white' }
                }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  // Full footer for authenticated users
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        py: { xs: 3, md: 4 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>
                  Crime Portal
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, letterSpacing: '0.05em' }}>
                  MANAGEMENT SYSTEM
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, lineHeight: 1.7 }}>
              Secure and efficient crime record management system for modern law enforcement agencies.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                size="small" 
                icon={<FiberManualRecordIcon sx={{ fontSize: 10, animation: 'pulse 2s infinite' }} />} 
                label="System Active" 
                sx={{ 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: '#4caf50'
                  }
                }}
              />
              <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600 }}>
                Version {pkg.version}
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2, opacity: 0.9 }}>
              QUICK ACCESS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link 
                href="/" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Dashboard
              </Link>
              <Link 
                href="/crimes" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Crimes
              </Link>
              <Link 
                href="/firs" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                FIRs
              </Link>
              <Link 
                href="/criminals" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Criminals
              </Link>
              {userRole === 'ADMIN' && (
                <Link 
                  href="/users" 
                  underline="hover" 
                  sx={{ 
                    color: 'white',
                    opacity: 0.8,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      opacity: 1,
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  User Management
                </Link>
              )}
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2, opacity: 0.9 }}>
              RESOURCES
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link 
                href="/documentation" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Documentation
              </Link>
              <Link 
                href="/privacy" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Terms of Service
              </Link>
              <Link 
                href="/support" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Support
              </Link>
              <Link 
                href="/team" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Our Team
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2, opacity: 0.9 }}>
              CONNECT WITH US
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8, fontSize: '0.875rem' }}>
              Stay updated with our latest features and security updates.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s',
                  '&:hover': { 
                    bgcolor: 'white',
                    color: '#667eea',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s',
                  '&:hover': { 
                    bgcolor: 'white',
                    color: '#667eea',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s',
                  '&:hover': { 
                    bgcolor: 'white',
                    color: '#667eea',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 2.5, md: 3 }, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
            © {year} Crime Portal. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Built with 
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-block',
                animation: 'heartbeat 1.5s ease-in-out infinite',
                '@keyframes heartbeat': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' }
                }
              }}
            >
              ❤️
            </Box> 
            for Law Enforcement
          </Typography>
        </Box>
      </Container>

      {/* Add keyframes for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Box>
  );
}
