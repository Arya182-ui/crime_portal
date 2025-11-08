import React from 'react';
import { Box, Container, Typography, Paper, Divider, List, ListItem, ListItemText, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function TermsOfService() {
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
              <GavelIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
              Terms of Service
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)">
              Legal agreement for using Crime Portal
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
            <Alert severity="info" sx={{ mb: 4 }}>
              <Typography variant="body2">
                By accessing and using Crime Portal, you accept and agree to be bound by the terms and provisions of
                this agreement. Please read these terms carefully before using our services.
              </Typography>
            </Alert>

            {/* Acceptance of Terms */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                1. Acceptance of Terms
              </Typography>
              <Typography paragraph>
                By registering for an account and using Crime Portal, you acknowledge that you have read, understood,
                and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these
                terms, you must not use our services.
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* User Responsibilities */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                2. User Responsibilities
              </Typography>
              <Typography paragraph sx={{ mb: 2 }}>
                As a user of Crime Portal, you agree to:
              </Typography>
              <List>
                <ListItem>
                  <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                  <ListItemText primary="Provide accurate and truthful information in all reports" />
                </ListItem>
                <ListItem>
                  <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                  <ListItemText primary="Use the platform only for legitimate crime reporting purposes" />
                </ListItem>
                <ListItem>
                  <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                  <ListItemText primary="Maintain the confidentiality of your account credentials" />
                </ListItem>
                <ListItem>
                  <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                  <ListItemText primary="Comply with all applicable laws and regulations" />
                </ListItem>
                <ListItem>
                  <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                  <ListItemText primary="Respect the privacy and rights of others" />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Prohibited Activities */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                3. Prohibited Activities
              </Typography>
              <Typography paragraph sx={{ mb: 2 }}>
                You expressly agree NOT to:
              </Typography>
              <List>
                <ListItem>
                  <CancelIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary="File false or fraudulent reports" />
                </ListItem>
                <ListItem>
                  <CancelIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary="Misuse or abuse the reporting system" />
                </ListItem>
                <ListItem>
                  <CancelIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary="Attempt to gain unauthorized access to the system" />
                </ListItem>
                <ListItem>
                  <CancelIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary="Share your account credentials with others" />
                </ListItem>
                <ListItem>
                  <CancelIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary="Use the platform for harassment or defamation" />
                </ListItem>
                <ListItem>
                  <CancelIcon sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary="Interfere with or disrupt the service" />
                </ListItem>
              </List>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <WarningIcon />
                <Typography variant="body2">
                  <strong>Warning:</strong> Filing false reports is a criminal offense punishable by law. Violators will
                  be prosecuted.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Data Usage */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                4. Data Usage and Retention
              </Typography>
              <Typography paragraph>
                Crime reports and FIRs filed through this portal are official legal documents. The information you
                provide:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="• Will be shared with relevant law enforcement agencies" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• May be used as evidence in legal proceedings" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Will be retained according to legal record-keeping requirements" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Cannot be deleted if part of an ongoing investigation" />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Account Termination */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                5. Account Termination
              </Typography>
              <Typography paragraph>
                We reserve the right to suspend or terminate your account if you:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="• Violate these Terms of Service" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• File false or fraudulent reports" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Engage in prohibited activities" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Compromise the security or integrity of the system" />
                </ListItem>
              </List>
              <Typography paragraph sx={{ mt: 2 }}>
                Termination does not affect the validity of reports already filed through your account.
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Limitation of Liability */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                6. Limitation of Liability
              </Typography>
              <Typography paragraph>
                Crime Portal is provided "as is" without warranties of any kind. We are not liable for:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="• Delays in investigation or case processing" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Actions or decisions made by law enforcement agencies" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Service interruptions or technical issues" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Loss of data due to circumstances beyond our control" />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Governing Law */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                7. Governing Law
              </Typography>
              <Typography paragraph>
                These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes
                arising from these terms shall be subject to the exclusive jurisdiction of courts in [Your
                Jurisdiction].
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Changes to Terms */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                8. Changes to Terms
              </Typography>
              <Typography paragraph>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                posting to the platform. Your continued use of Crime Portal after changes are posted constitutes your
                acceptance of the modified terms.
              </Typography>
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
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Questions About These Terms?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For questions or concerns about these Terms of Service, contact us at:
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
