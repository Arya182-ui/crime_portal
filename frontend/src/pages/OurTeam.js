import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  School as SchoolIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  BugReport as BugReportIcon,
  Description as DescriptionIcon,
  Engineering as EngineeringIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

const teamMembers = [
  {
    name: 'Ayush Gangwar',
    rollNo: 'BCS2023030',
    role: 'Project Lead & Full Stack Developer',
    avatar: 'AG',
    color: '#1976d2',
    icon: <EngineeringIcon />,
    skills: ['React', 'Spring Boot', 'Firebase', 'System Architecture'],
  },
  {
    name: 'Pratham Kumar',
    rollNo: 'BCS2023015',
    role: 'Assistant Lead & Backend Developer',
    avatar: 'PK',
    color: '#2e7d32',
    icon: <CodeIcon />,
    skills: ['Java', 'Spring Boot', 'REST APIs', 'Firebase Admin'],
  },
  {
    name: 'Jatin Sharma',
    rollNo: 'BCS2023025',
    role: 'UI/UX Designer & Frontend Developer',
    avatar: 'JS',
    color: '#ed6c02',
    icon: <CodeIcon />,
    skills: ['React', 'Material-UI', 'JavaScript', 'State Management'],
  },
  {
    name: 'Neha Gangwar',
    rollNo: 'BCS2023048',
    role: 'Frontend Developer',
    avatar: 'NG',
    color: '#9c27b0',
    icon: <PaletteIcon />,
    skills: ['UI/UX Design', 'React', 'Figma', 'Responsive Design'],
  },
  {
    name: 'Pallavi Kumari',
    rollNo: 'BCS2023115',
    role: 'Database Administrator',
    avatar: 'PG',
    color: '#d32f2f',
    icon: <StorageIcon />,
    skills: ['Firestore', 'Database Design', 'Data Modeling', 'Java'],
  },
  {
    name: 'Aditya Raj',
    rollNo: 'BCS2023014',
    role: 'Testing & Quality Assurance',
    avatar: 'AR',
    color: '#0288d1',
    icon: <BugReportIcon />,
    skills: ['Testing', 'Bug Tracking', 'Quality Assurance', 'Documentation'],
  },
  {
    name: 'Sanjeev Maurya',
    rollNo: 'BCS2023024',
    role: 'Documentation & API Development',
    avatar: 'SM',
    color: '#f57c00',
    icon: <DescriptionIcon />,
    skills: ['Technical Writing', 'API Design', 'Documentation', 'Postman'],
  },
];

const mentor = {
  name: 'Chetan Dhakad',
  role: 'Project Mentor & Guide',
  avatar: 'CD',
  avatarImage: 'https://i.ibb.co/yFRBFP8b/Whats-App-Image-2025-11-08-at-22-27-58-feb0037b.jpg', // Use direct image link
  color: '#6a1b9a',
  icon: <PsychologyIcon />,
  skills: ['Project Guidance', 'Technical Mentorship', 'Code Review', 'Best Practices'],
};

const OurTeam = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Our Team
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Crime Information Management System
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="800px" mx="auto">
              Meet the talented team behind this comprehensive crime management portal. 
              A college project developed with dedication, innovation, and teamwork.
            </Typography>
          </Paper>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[10],
                      },
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    {/* Top Color Bar */}
                    <Box
                      sx={{
                        height: 6,
                        background: `linear-gradient(90deg, ${member.color} 0%, ${alpha(
                          member.color,
                          0.6
                        )} 100%)`,
                      }}
                    />

                    <CardContent sx={{ pt: 4, pb: 3 }}>
                      {/* Avatar */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: member.color,
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            border: `4px solid ${alpha(member.color, 0.2)}`,
                          }}
                        >
                          {member.avatar}
                        </Avatar>
                      </Box>

                      {/* Name and Roll Number */}
                      <Typography
                        variant="h6"
                        align="center"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                        gutterBottom
                      >
                        {member.rollNo}
                      </Typography>

                      {/* Role with Icon */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          mb: 2,
                          mt: 2,
                        }}
                      >
                        <Box sx={{ color: member.color }}>{member.icon}</Box>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight="600"
                          align="center"
                        >
                          {member.role}
                        </Typography>
                      </Box>

                      {/* Skills */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          justifyContent: 'center',
                          mt: 2,
                        }}
                      >
                        {member.skills.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            sx={{
                              bgcolor: alpha(member.color, 0.1),
                              color: member.color,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Mentor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            fontWeight="bold" 
            sx={{ mt: 6, mb: 3 }}
          >
            Project Mentor
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Card
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[20],
                  },
                  position: 'relative',
                  overflow: 'visible',
                  border: `2px solid ${mentor.color}`,
                }}
              >
                {/* Top Color Bar */}
                <Box
                  sx={{
                    height: 8,
                    background: `linear-gradient(90deg, ${mentor.color} 0%, ${alpha(
                      mentor.color,
                      0.6
                    )} 100%)`,
                  }}
                />

                <CardContent sx={{ pt: 4, pb: 3, textAlign: 'center' }}>
                  {/* Avatar */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar
                      src={mentor.avatarImage}
                      alt={mentor.name}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: mentor.color,
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        border: `4px solid ${alpha(mentor.color, 0.2)}`,
                        boxShadow: theme.shadows[8],
                      }}
                    >
                      {mentor.avatar}
                    </Avatar>
                  </Box>

                  {/* Name */}
                  <Typography
                    variant="h5"
                    align="center"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {mentor.name}
                  </Typography>

                  {/* Role with Icon */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 3,
                      mt: 2,
                    }}
                  >
                    <Box sx={{ color: mentor.color }}>{mentor.icon}</Box>
                    <Typography
                      variant="body1"
                      color="primary"
                      fontWeight="600"
                      align="center"
                    >
                      {mentor.role}
                    </Typography>
                  </Box>

                  {/* Skills */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      justifyContent: 'center',
                      mt: 2,
                    }}
                  >
                    {mentor.skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="medium"
                        sx={{
                          bgcolor: alpha(mentor.color, 0.1),
                          color: mentor.color,
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Project Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: 4,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.main,
                0.1
              )} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              College Project 2024-2025
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Developed as part of our academic curriculum
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Chip
                label="Spring Boot 3.1.4"
                color="success"
                variant="outlined"
              />
              <Chip
                label="React 18"
                color="info"
                variant="outlined"
              />
              <Chip
                label="Firebase"
                color="warning"
                variant="outlined"
              />
              <Chip
                label="Material-UI"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OurTeam;
