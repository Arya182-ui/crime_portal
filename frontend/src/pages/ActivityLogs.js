import React, { useState, useEffect } from 'react';
import {
  Box, Card, Typography, TextField, Button, Stack, 
  Chip, InputAdornment, Avatar, Grid,
  Alert, Snackbar, FormControl, InputLabel, Select, MenuItem,
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent,
  Paper, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { createApiClient } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

const ActionIcons = {
  CREATE: CreateIcon,
  UPDATE: EditIcon,
  DELETE: DeleteIcon,
  VIEW: VisibilityIcon
};

const ActionColors = {
  CREATE: 'success',
  UPDATE: 'primary',
  DELETE: 'error',
  VIEW: 'info'
};

const EntityIcons = {
  CRIME: GavelIcon,
  FIR: DescriptionIcon,
  CRIMINAL: PeopleIcon,
  USER: PersonIcon
};

const ActivityLogs = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const apiClient = createApiClient();

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [entityTypeFilter, actionFilter]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (entityTypeFilter) params.append('entityType', entityTypeFilter);
      if (actionFilter) params.append('action', actionFilter);
      
      const res = await apiClient.get(`/activity${params.toString() ? '?' + params.toString() : ''}`);
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      showSnackbar('Failed to load activity logs', 'error');
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/activity/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching activity stats:', err);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredActivities = activities.filter(a => 
    a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.entityType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              width: 56,
              height: 56
            }}>
              <HistoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Activity Logs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track all system activities and user actions
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, boxShadow: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                      Total Activities
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="white">
                      {stats.totalActivities || 0}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <BarChartIcon sx={{ color: 'white' }} />
                  </Avatar>
                </Box>
              </Card>
            </Grid>

            {stats.topUsers && stats.topUsers.length > 0 && (
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, boxShadow: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Most Active User
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stats.topUsers[0].username}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {stats.topUsers[0].count} activities
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            )}

            {stats.actionBreakdown && Object.keys(stats.actionBreakdown).length > 0 && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, boxShadow: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Creates
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {stats.actionBreakdown.CREATE || 0}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, boxShadow: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Updates
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        {stats.actionBreakdown.UPDATE || 0}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </motion.div>
      )}

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ p: 3, mb: 3, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search activities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={entityTypeFilter}
                  onChange={e => setEntityTypeFilter(e.target.value)}
                  label="Entity Type"
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="CRIME">Crime</MenuItem>
                  <MenuItem value="FIR">FIR</MenuItem>
                  <MenuItem value="CRIMINAL">Criminal</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Action</InputLabel>
                <Select
                  value={actionFilter}
                  onChange={e => setActionFilter(e.target.value)}
                  label="Action"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Actions</MenuItem>
                  <MenuItem value="CREATE">Create</MenuItem>
                  <MenuItem value="UPDATE">Update</MenuItem>
                  <MenuItem value="DELETE">Delete</MenuItem>
                  <MenuItem value="VIEW">View</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card sx={{ p: 3, boxShadow: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Activity Timeline
          </Typography>
          
          {filteredActivities.length > 0 ? (
            <Timeline position="right">
              {filteredActivities.map((activity, index) => {
                const ActionIconComponent = ActionIcons[activity.action] || HistoryIcon;
                const EntityIconComponent = EntityIcons[activity.entityType] || CategoryIcon;
                
                return (
                  <TimelineItem key={activity.id}>
                    <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                      <Typography variant="caption" display="block">
                        {formatDate(activity.timestamp)}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.disabled">
                        {formatFullDate(activity.timestamp)}
                      </Typography>
                    </TimelineOppositeContent>
                    
                    <TimelineSeparator>
                      <TimelineDot color={ActionColors[activity.action] || 'grey'} variant="outlined">
                        <ActionIconComponent sx={{ fontSize: 20 }} />
                      </TimelineDot>
                      {index < filteredActivities.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <EntityIconComponent sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Chip 
                            label={activity.entityType}
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                          <Chip 
                            label={activity.action}
                            size="small"
                            color={ActionColors[activity.action] || 'default'}
                          />
                        </Box>
                        
                        <Typography variant="body1" fontWeight={500}>
                          {activity.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            by <strong>{activity.username || 'Unknown User'}</strong>
                          </Typography>
                          {activity.ipAddress && (
                            <Typography variant="caption" color="text.disabled">
                              • {activity.ipAddress}
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <HistoryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No activities found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {searchTerm || entityTypeFilter || actionFilter 
                  ? 'Try adjusting your filters' 
                  : 'Activity logs will appear here as actions are performed'}
              </Typography>
            </Box>
          )}
        </Card>
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityLogs;
