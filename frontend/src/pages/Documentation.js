import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ApiIcon from '@mui/icons-material/Api';

export default function Documentation() {
  const [expanded, setExpanded] = useState('getting-started');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const quickStartSteps = [
    { title: 'Register Account', desc: 'Create your account with Firebase Auth', icon: <PersonIcon /> },
    { title: 'Set Your Role', desc: 'Admin assigns OFFICER/ADMIN/USER role', icon: <CheckCircleIcon /> },
    { title: 'File Reports', desc: 'Create crimes, FIRs, and criminal records', icon: <GavelIcon /> },
    { title: 'Track Status', desc: 'Monitor reports with real-time updates', icon: <AssessmentIcon /> },
  ];

  const apiEndpoints = [
    // Dashboard & Stats
    { method: 'GET', endpoint: '/api/dashboard/stats', desc: 'Get comprehensive dashboard statistics', category: 'Dashboard' },
    { method: 'GET', endpoint: '/api/dashboard/charts/monthly', desc: 'Get monthly trend data', category: 'Dashboard' },
    { method: 'GET', endpoint: '/api/dashboard/top-locations', desc: 'Get top crime locations', category: 'Dashboard' },
    { method: 'GET', endpoint: '/api/stats', desc: 'Get basic statistics', category: 'Dashboard' },
    
    // Crimes
    { method: 'GET', endpoint: '/api/crimes', desc: 'List crimes with filters (status, category, severity)', category: 'Crimes' },
    { method: 'GET', endpoint: '/api/crimes/{id}', desc: 'Get specific crime by ID', category: 'Crimes' },
    { method: 'POST', endpoint: '/api/crimes', desc: 'Create new crime report', category: 'Crimes' },
    { method: 'PUT', endpoint: '/api/crimes/{id}', desc: 'Update crime details', category: 'Crimes' },
    { method: 'DELETE', endpoint: '/api/crimes/{id}', desc: 'Delete crime record', category: 'Crimes' },
    
    // FIRs
    { method: 'GET', endpoint: '/api/firs/search', desc: 'Search FIRs with filters', category: 'FIRs' },
    { method: 'GET', endpoint: '/api/firs/{id}', desc: 'Get FIR by ID', category: 'FIRs' },
    { method: 'POST', endpoint: '/api/firs', desc: 'File new FIR', category: 'FIRs' },
    { method: 'PUT', endpoint: '/api/firs/{id}', desc: 'Update FIR status/details', category: 'FIRs' },
    { method: 'DELETE', endpoint: '/api/firs/{id}', desc: 'Delete FIR', category: 'FIRs' },
    
    // Criminals
    { method: 'GET', endpoint: '/api/criminals', desc: 'List all criminal records', category: 'Criminals' },
    { method: 'GET', endpoint: '/api/criminals/{id}', desc: 'Get criminal profile', category: 'Criminals' },
    { method: 'POST', endpoint: '/api/criminals', desc: 'Create criminal record', category: 'Criminals' },
    { method: 'PUT', endpoint: '/api/criminals/{id}', desc: 'Update criminal information', category: 'Criminals' },
    { method: 'DELETE', endpoint: '/api/criminals/{id}', desc: 'Delete criminal record', category: 'Criminals' },
    
    // Settings (Admin Only)
    { method: 'GET', endpoint: '/api/settings', desc: 'List system settings', category: 'Settings', admin: true },
    { method: 'POST', endpoint: '/api/settings', desc: 'Create new setting', category: 'Settings', admin: true },
    { method: 'PUT', endpoint: '/api/settings/{id}', desc: 'Update setting', category: 'Settings', admin: true },
    { method: 'DELETE', endpoint: '/api/settings/{id}', desc: 'Delete setting', category: 'Settings', admin: true },
    
    // Activity Logs
    { method: 'GET', endpoint: '/api/activity', desc: 'Get activity logs with filters', category: 'Activity' },
    { method: 'GET', endpoint: '/api/activity/stats', desc: 'Get activity statistics', category: 'Activity' },
    
    // Authentication
    { method: 'POST', endpoint: '/api/auth/set-my-role', desc: 'Set user role (dev only)', category: 'Auth' },
    { method: 'GET', endpoint: '/api/auth/me', desc: 'Get current user info', category: 'Auth' },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                mb: 3,
              }}
            >
              <DescriptionIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
              Documentation
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)">
              Everything you need to know about Crime Portal
            </Typography>
          </Box>

          {/* Quick Start Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickStartSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          mx: 'auto',
                          mb: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {step.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Main Documentation Content */}
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.9)'
                  : 'rgba(255, 255, 255, 0.95)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 4 }}>
              {/* Getting Started */}
              <Accordion expanded={expanded === 'getting-started'} onChange={handleChange('getting-started')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <InfoIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Getting Started
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography paragraph>
                    Welcome to Crime Portal! This platform helps citizens report crimes, file FIRs, and track their
                    cases efficiently.
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Create an Account"
                        secondary="Register with your email and personal details"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Verify Your Identity"
                        secondary="Complete your profile with valid identification"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Start Filing Reports"
                        secondary="Access dashboard to file FIRs and crime reports"
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2 }} />

              {/* User Roles */}
              <Accordion expanded={expanded === 'roles'} onChange={handleChange('roles')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      User Roles & Permissions
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.lighter', borderRadius: 2 }}>
                        <Chip label="ADMIN" color="error" sx={{ mb: 2, fontWeight: 600 }} />
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Full System Access
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • Manage all crimes, FIRs, criminals<br/>
                          • User management & role assignment<br/>
                          • System settings configuration<br/>
                          • View all activity logs<br/>
                          • Dashboard analytics<br/>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.lighter', borderRadius: 2 }}>
                        <Chip label="OFFICER" color="primary" sx={{ mb: 2, fontWeight: 600 }} />
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Law Enforcement Access
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • Create & manage crimes<br/>
                          • File and update FIRs<br/>
                          • Manage criminal records<br/>
                          • View assigned cases<br/>
                          • Update case status<br/>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Chip label="USER" color="default" sx={{ mb: 2, fontWeight: 600 }} />
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Citizen Access
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • File FIR reports<br/>
                          • View public crime data<br/>
                          • Track own FIR status<br/>
                          • View dashboard stats<br/>
                          • Read-only criminal database<br/>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2 }} />

              {/* Filing FIR */}
              <Accordion expanded={expanded === 'fir'} onChange={handleChange('fir')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GavelIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Filing an FIR
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography paragraph fontWeight={600}>
                    Steps to file an FIR:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Typography fontWeight={600} color="primary">
                          1.
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Navigate to FIR Section"
                        secondary="Click 'File FIR' from dashboard or FIR page"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography fontWeight={600} color="primary">
                          2.
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Fill Required Information"
                        secondary="Provide incident details, location, date/time, and description"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography fontWeight={600} color="primary">
                          3.
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Review & Submit"
                        secondary="Double-check all information before submission"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography fontWeight={600} color="primary">
                          4.
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary="Get FIR Number"
                        secondary="Save your FIR reference number for tracking"
                      />
                    </ListItem>
                  </List>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: 'info.light',
                      color: 'info.contrastText',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Note:</strong> FIRs are legally binding documents. Ensure all information provided is
                      accurate and truthful.
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2 }} />

              {/* API Documentation */}
              <Accordion expanded={expanded === 'api'} onChange={handleChange('api')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ApiIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      API Reference
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography paragraph>Base URL: http://localhost:8080</Typography>
                  <Box sx={{ mt: 2 }}>
                    {apiEndpoints.map((endpoint, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          mb: 1,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          fontFamily: 'monospace',
                        }}
                      >
                        <Chip
                          label={endpoint.method}
                          size="small"
                          color={
                            endpoint.method === 'GET'
                              ? 'success'
                              : endpoint.method === 'POST'
                              ? 'primary'
                              : 'warning'
                          }
                          sx={{ minWidth: 60, fontWeight: 600 }}
                        />
                        <Typography sx={{ flex: 1, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          {endpoint.endpoint}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {endpoint.desc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: 'warning.light',
                      color: 'warning.contrastText',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Authentication:</strong> All API requests require a valid JWT token in the Authorization
                      header.
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2 }} />

              {/* Technical Details */}
              <Accordion expanded={expanded === 'technical'} onChange={handleChange('technical')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CodeIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Technical Specifications
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Frontend Stack
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="• React 18.x" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• Material-UI v5" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• Framer Motion" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• Recharts" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• Firebase Auth" />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Backend Stack
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="• Spring Boot 3.x" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• Firebase Admin SDK" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• RESTful API" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• JWT Authentication" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="• MySQL Database" />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
