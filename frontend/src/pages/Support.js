import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Button,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SendIcon from '@mui/icons-material/Send';

export default function Support() {
  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState('faq1');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

    const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: 'Crime Portal Team', // Your name/team name
        },
        EMAILJS_PUBLIC_KEY
      );

      console.log('Email sent successfully:', result);
      
      setSnackbar({
        open: true,
        message: 'Message sent successfully! We will get back to you soon.',
        severity: 'success',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
    } catch (error) {
      console.error('Email send error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again or contact us directly.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const contactMethods = [
    {
      icon: <EmailIcon />,
      title: 'Email Support',
      primary: 'arya119000@gmail.com',
      secondary: 'Response within 24 hours',
      color: '#667eea',
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone Support',
      primary: '1800-XXX-XXXX',
      secondary: '24/7 Emergency Hotline',
      color: '#764ba2',
    },
    {
      icon: <LocationOnIcon />,
      title: 'Visit Office',
      primary: 'Crime Portal HQ',
      secondary: 'New Delhi, India',
      color: '#f093fb',
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Working Hours',
      primary: 'Mon - Fri: 9 AM - 6 PM',
      secondary: 'Emergency: 24/7',
      color: '#4facfe',
    },
  ];

  const faqs = [
    {
      id: 'faq1',
      question: 'How do I file an FIR online?',
      answer:
        'Navigate to the FIR section from your dashboard, click "File New FIR", fill in all required details including incident description, location, and date/time. Review your information and submit. You will receive an FIR reference number immediately.',
    },
    {
      id: 'faq2',
      question: 'How can I track the status of my complaint?',
      answer:
        'Go to your Dashboard and view the "Recent Activity" section. Click on any report to see its current status, assigned officer, and case updates. You will also receive email notifications for major status changes.',
    },
    {
      id: 'faq3',
      question: 'What should I do if I forgot my password?',
      answer:
        'Click "Forgot Password" on the login page. Enter your registered email address, and you will receive a password reset link. Follow the instructions in the email to create a new password.',
    },
    {
      id: 'faq4',
      question: 'Can I edit my FIR after submission?',
      answer:
        'No, FIRs cannot be edited once submitted as they are legal documents. However, you can add additional information by contacting the assigned officer or visiting the police station with your FIR number.',
    },
    {
      id: 'faq5',
      question: 'How long does it take to get a response?',
      answer:
        'Response times vary based on the severity and type of case. Emergency cases receive immediate attention. For general queries, you can expect a response within 24-48 hours. Track your case status on the dashboard for updates.',
    },
    {
      id: 'faq6',
      question: 'Is my personal information secure?',
      answer:
        'Yes, we use industry-standard encryption and security measures to protect your data. All information is stored securely and only accessible to authorized personnel. Read our Privacy Policy for more details.',
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
              <SupportAgentIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
              Support Center
            </Typography>
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)">
              We're here to help you 24/7
            </Typography>
          </Box>

          {/* Contact Methods */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {contactMethods.map((method, index) => (
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
                          bgcolor: method.color,
                        }}
                      >
                        {method.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {method.title}
                      </Typography>
                      <Typography variant="body1" fontWeight={500} color="primary">
                        {method.primary}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {method.secondary}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={24}
                sx={{
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(30, 41, 59, 0.9)'
                      : 'rgba(255, 255, 255, 0.95)',
                  p: 4,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <EmailIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight={600}>
                    Send us a Message
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  For emergency situations, please call our 24/7 hotline immediately.
                </Alert>

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<SendIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </form>
              </Paper>
            </Grid>

            {/* FAQs */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={24}
                sx={{
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(30, 41, 59, 0.9)'
                      : 'rgba(255, 255, 255, 0.95)',
                  p: 4,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <HelpOutlineIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h5" fontWeight={600}>
                    Frequently Asked Questions
                  </Typography>
                </Box>

                <Box sx={{ maxHeight: 520, overflow: 'auto', pr: 1 }}>
                  {faqs.map((faq) => (
                    <Accordion
                      key={faq.id}
                      expanded={expanded === faq.id}
                      onChange={handleAccordionChange(faq.id)}
                      sx={{ mb: 1, '&:before': { display: 'none' } }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600}>{faq.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography color="text.secondary">{faq.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Can't find what you're looking for?
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                    Check our <Chip label="Documentation" size="small" color="primary" clickable /> for more help
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}
