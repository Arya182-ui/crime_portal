import React from 'react';
import { Box, Container, Typography, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import ShareIcon from '@mui/icons-material/Share';
import CookieIcon from '@mui/icons-material/Cookie';
import EmailIcon from '@mui/icons-material/Email';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <StorageIcon />,
      title: 'Information We Collect',
      content: [
        'Personal identification information (Name, email address, phone number)',
        'Government-issued ID for identity verification',
        'Crime report details and FIR information',
        'Usage data and analytics',
        'Device information and IP addresses',
      ],
    },
    {
      icon: <SecurityIcon />,
      title: 'How We Use Your Information',
      content: [
        'To process and manage crime reports and FIRs',
        'To verify user identity and maintain security',
        'To communicate case updates and notifications',
        'To improve our services and user experience',
        'To comply with legal obligations and law enforcement requests',
      ],
    },
    {
      icon: <ShareIcon />,
      title: 'Information Sharing',
      content: [
        'Law enforcement agencies (when legally required)',
        'Judicial authorities (for court proceedings)',
        'Government agencies (for statistical purposes)',
        'We NEVER sell your personal information to third parties',
        'Strict access controls for authorized personnel only',
      ],
    },
    {
      icon: <CookieIcon />,
      title: 'Cookies & Tracking',
      content: [
        'We use essential cookies for authentication',
        'Analytics cookies to improve user experience',
        'You can control cookie preferences in your browser',
        'No third-party advertising cookies',
        'Session data is encrypted and secure',
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
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
              <PrivacyTipIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
              Privacy Policy
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)">
              Your privacy and data security are our top priorities
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.8)" sx={{ mt: 2 }}>
              Last Updated: November 7, 2025
            </Typography>
          </Box>

          {/* Main Content */}
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(30, 41, 59, 0.9)'
                  : 'rgba(255, 255, 255, 0.95)',
              p: 5,
            }}
          >
            {/* Introduction */}
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              At Crime Portal, we are committed to protecting your personal information and your right to privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
              crime reporting and management system.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Sections */}
            {sections.map((section, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      p: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {section.title}
                  </Typography>
                </Box>
                <List>
                  {section.content.map((item, i) => (
                    <ListItem key={i} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}

            <Divider sx={{ my: 4 }} />

            {/* Data Security */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Data Security
              </Typography>
              <Typography paragraph>
                We implement industry-standard security measures to protect your personal information:
              </Typography>
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  ✓ End-to-end encryption for sensitive data
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  ✓ Secure Firebase Authentication
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  ✓ Regular security audits and updates
                </Typography>
                <Typography variant="body2">✓ Role-based access control</Typography>
              </Box>
            </Box>

            {/* Your Rights */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Your Rights
              </Typography>
              <Typography paragraph>Under applicable data protection laws, you have the right to:</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="• Access and review your personal data" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Request correction of inaccurate information" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Request deletion of your data (subject to legal requirements)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Object to processing of your data" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Withdraw consent at any time" />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Contact */}
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                bgcolor: 'action.hover',
                borderRadius: 2,
              }}
            >
              <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Questions About Privacy?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you have any questions or concerns about this Privacy Policy, please contact our Data Protection
                Officer at:
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 2 }}>
                arya119000@gmail.com
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
