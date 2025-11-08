import React, { useState, useEffect } from 'react';
import {
  Box, Card, Typography, TextField, Button, Stack, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, InputAdornment, Divider, Avatar,
  FormControl, InputLabel, Select, MenuItem, Grid,
  Alert, Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PublicIcon from '@mui/icons-material/Public';
import FilterListIcon from '@mui/icons-material/FilterList';
import { createApiClient } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

const SettingsCategoryIcons = {
  GENERAL: PublicIcon,
  SECURITY: SecurityIcon,
  EMAIL: EmailIcon,
  NOTIFICATIONS: NotificationsIcon
};

const SettingsCategoryColors = {
  GENERAL: 'primary',
  SECURITY: 'error',
  EMAIL: 'info',
  NOTIFICATIONS: 'warning'
};

const SystemSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [form, setForm] = useState({
    key: '',
    value: '',
    description: '',
    category: 'GENERAL'
  });

  const apiClient = createApiClient();

  useEffect(() => {
    fetchSettings();
  }, [categoryFilter]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      
      const res = await apiClient.get(`/settings${params.toString() ? '?' + params.toString() : ''}`);
      setSettings(res.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      showSnackbar('Failed to load settings', 'error');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing) {
        await apiClient.put(`/settings/${editing}`, form);
        showSnackbar('Setting updated successfully', 'success');
      } else {
        await apiClient.post('/settings', form);
        showSnackbar('Setting created successfully', 'success');
      }
      
      setOpenDialog(false);
      setEditing(null);
      setForm({ key: '', value: '', description: '', category: 'GENERAL' });
      fetchSettings();
    } catch (err) {
      console.error('Error saving setting:', err);
      showSnackbar(err.response?.data?.message || 'Failed to save setting', 'error');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this setting?')) return;
    
    setLoading(true);
    try {
      await apiClient.delete(`/settings/${id}`);
      showSnackbar('Setting deleted successfully', 'success');
      fetchSettings();
    } catch (err) {
      console.error('Error deleting setting:', err);
      showSnackbar('Failed to delete setting', 'error');
    }
    setLoading(false);
  };

  const handleEditOpen = (setting) => {
    setEditing(setting.id);
    setForm({
      key: setting.key,
      value: setting.value,
      description: setting.description || '',
      category: setting.category
    });
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditing(null);
    setForm({ key: '', value: '', description: '', category: 'GENERAL' });
    setOpenDialog(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredSettings = settings.filter(s => 
    s.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check if user is admin
  if (user?.role !== 'ADMIN') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <SecurityIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography color="text.secondary">
          You need administrator privileges to access this page.
        </Typography>
      </Box>
    );
  }

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
              <SettingsIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                System Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage application configuration and preferences
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
              }
            }}
          >
            Add Setting
          </Button>
        </Box>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card sx={{ p: 3, mb: 3, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search settings by key or description..."
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category Filter</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  label="Category Filter"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="GENERAL">General</MenuItem>
                  <MenuItem value="SECURITY">Security</MenuItem>
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="NOTIFICATIONS">Notifications</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </motion.div>

      {/* Settings List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3}>
          {filteredSettings.map((setting, index) => {
            const CategoryIconComponent = SettingsCategoryIcons[setting.category] || PublicIcon;
            return (
              <Grid item xs={12} key={setting.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    sx={{ 
                      p: 3,
                      boxShadow: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: `${SettingsCategoryColors[setting.category]}.lighter`,
                          color: `${SettingsCategoryColors[setting.category]}.main`
                        }}>
                          <CategoryIconComponent />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <VpnKeyIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="h6" fontWeight={600}>
                              {setting.key}
                            </Typography>
                            <Chip 
                              label={setting.category}
                              size="small"
                              color={SettingsCategoryColors[setting.category]}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              mb: 1,
                              fontFamily: 'monospace',
                              bgcolor: 'action.hover',
                              p: 1,
                              borderRadius: 1,
                              display: 'inline-block'
                            }}
                          >
                            {setting.value}
                          </Typography>
                          
                          {setting.description && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                              <DescriptionIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                              <Typography variant="body2" color="text.secondary">
                                {setting.description}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditOpen(setting)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.lighter',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(setting.id)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'error.lighter',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {filteredSettings.length === 0 && !loading && (
          <Card sx={{ p: 6, textAlign: 'center', boxShadow: 2 }}>
            <SettingsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No settings found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm || categoryFilter ? 'Try adjusting your filters' : 'Click "Add Setting" to create your first setting'}
            </Typography>
          </Card>
        )}
      </motion.div>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => { setOpenDialog(false); setEditing(null); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              width: 40,
              height: 40
            }}>
              <SettingsIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              {editing ? 'Edit Setting' : 'Add New Setting'}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            <TextField 
              label="Setting Key" 
              value={form.key} 
              onChange={e=>setForm({...form, key:e.target.value})} 
              fullWidth
              required
              disabled={editing !== null}
              placeholder="e.g., app.name, max.login.attempts"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            
            <TextField 
              label="Setting Value" 
              value={form.value} 
              onChange={e=>setForm({...form, value:e.target.value})} 
              fullWidth
              required
              placeholder="Enter the value for this setting"
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                onChange={e=>setForm({...form, category:e.target.value})}
                label="Category"
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="GENERAL">General</MenuItem>
                <MenuItem value="SECURITY">Security</MenuItem>
                <MenuItem value="EMAIL">Email</MenuItem>
                <MenuItem value="NOTIFICATIONS">Notifications</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              label="Description" 
              value={form.description} 
              onChange={e=>setForm({...form, description:e.target.value})} 
              fullWidth 
              multiline 
              rows={3}
              placeholder="Describe what this setting does..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={()=>{ setOpenDialog(false); setEditing(null); }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={loading || !form.key || !form.value}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }
            }}
          >
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default SystemSettings;
