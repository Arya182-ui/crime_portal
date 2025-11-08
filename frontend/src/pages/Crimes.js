import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createApiClient } from '../services/api';
import {
  Box, Typography, Paper, Button, Stack, Divider, TextField,
  List, ListItem, ListItemText, IconButton, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Avatar, Card, CardContent, Chip, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  Refresh as RefreshIcon, Gavel as GavelIcon, LocationOn as LocationIcon,
  Description as DescriptionIcon, CalendarToday as CalendarIcon,
  Search as SearchIcon, FilterList as FilterIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Crimes(){
  const { idToken, user } = useAuth();
  const api = createApiClient(idToken);

  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title:'', 
    location:'', 
    description:'', 
    date:'', 
    category:'', 
    severity:'', 
    status:'' 
  });
  const [snack, setSnack] = useState({ open:false, severity:'success', message:'' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status:'', category:'', severity:'' });

  const fetchList = async (q='') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.append('title', q);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.severity) params.append('severity', filters.severity);
      
      const queryString = params.toString();
      const resp = await api.get('/crimes' + (queryString ? `?${queryString}` : ''));
      setCrimes(resp.data.items || []);
    } catch (e) {
      console.error(e);
      setSnack({ open:true, severity:'error', message:'Failed to load crimes' });
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchList(); }, []);

  const openCreate = () => { 
    setEditing(null); 
    setForm({ 
      title:'', 
      location:'', 
      description:'', 
      date:'', 
      category:'', 
      severity:'', 
      status:'REPORTED' 
    }); 
    setDialogOpen(true); 
  };

  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ 
      title:c.title||'', 
      location:c.location||'', 
      description:c.description||'', 
      date: c.date || '', 
      category:c.category||'',
      severity:c.severity||'',
      status:c.status||'REPORTED'
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.location) { 
      setSnack({ open:true, severity:'warning', message:'Title and location required' }); 
      return; 
    }
    setLoading(true);
    try {
      const payload = { 
        title: form.title, 
        location: form.location, 
        description: form.description,
        category: form.category,
        severity: form.severity,
        status: form.status
      };
      if (form.date) payload.date = new Date(form.date).toISOString();
      
      if (editing) {
        await api.put(`/crimes/${editing}`, payload);
        setSnack({ open:true, severity:'success', message:'Crime updated successfully' });
      } else {
        await api.post('/crimes', payload);
        setSnack({ open:true, severity:'success', message:'Crime created successfully' });
      }
      setDialogOpen(false);
      await fetchList();
    } catch (e) {
      console.error(e);
      setSnack({ open:true, severity:'error', message: e?.response?.data?.error || 'Save failed' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this crime record? This action cannot be undone.')) return;
    setLoading(true);
    try {
      await api.delete(`/crimes/${id}`);
      setSnack({ open:true, severity:'success', message:'Crime deleted successfully' });
      await fetchList();
    } catch (e) {
      console.error(e);
      setSnack({ open:true, severity:'error', message:'Delete failed' });
    } finally { setLoading(false); }
  };

  const handleSearch = () => {
    fetchList(searchTerm);
  };

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ p: { xs: 2, md: 4 } }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: 48,
                height: 48
              }}
            >
              <GavelIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Crime Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage crime records
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={()=>fetchList()} 
              color="primary"
              sx={{ 
                '&:hover': { 
                  transform: 'rotate(180deg)',
                  transition: 'transform 0.3s'
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
            <Button 
              startIcon={<AddIcon />} 
              variant="contained" 
              onClick={openCreate}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              New Crime
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Search & Content Card */}
      <Card 
        elevation={0} 
        sx={{ 
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Search Field */}
          <TextField 
            fullWidth
            size="small" 
            placeholder="Search by crime title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') handleSearch(); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setSearchTerm(''); fetchList(); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => {
                    setFilters({...filters, status: e.target.value});
                    setTimeout(() => fetchList(searchTerm), 100);
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="REPORTED">Reported</MenuItem>
                  <MenuItem value="INVESTIGATING">Investigating</MenuItem>
                  <MenuItem value="SOLVED">Solved</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                  <MenuItem value="COLD_CASE">Cold Case</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => {
                    setFilters({...filters, category: e.target.value});
                    setTimeout(() => fetchList(searchTerm), 100);
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="THEFT">Theft</MenuItem>
                  <MenuItem value="ROBBERY">Robbery</MenuItem>
                  <MenuItem value="ASSAULT">Assault</MenuItem>
                  <MenuItem value="MURDER">Murder</MenuItem>
                  <MenuItem value="FRAUD">Fraud</MenuItem>
                  <MenuItem value="CYBERCRIME">Cybercrime</MenuItem>
                  <MenuItem value="KIDNAPPING">Kidnapping</MenuItem>
                  <MenuItem value="DRUG_TRAFFICKING">Drug Trafficking</MenuItem>
                  <MenuItem value="DOMESTIC_VIOLENCE">Domestic Violence</MenuItem>
                  <MenuItem value="VANDALISM">Vandalism</MenuItem>
                  <MenuItem value="BURGLARY">Burglary</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  label="Severity"
                  onChange={(e) => {
                    setFilters({...filters, severity: e.target.value});
                    setTimeout(() => fetchList(searchTerm), 100);
                  }}
                >
                  <MenuItem value="">All Severities</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Crime List */}
          {loading ? (
            <Box sx={{ display:'flex', justifyContent:'center', p:4 }}>
              <CircularProgress/>
            </Box>
          ) : crimes.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 2
              }}
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'action.hover'
                }}
              >
                <GavelIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Crimes Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first crime record to get started'}
              </Typography>
              {!searchTerm && (
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={openCreate}
                >
                  Add First Crime
                </Button>
              )}
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {crimes.map((c, index) => (
                <React.Fragment key={c.id}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 2,
                      transition: 'background-color 0.2s',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                    secondaryAction={(
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          edge="end" 
                          onClick={()=>openEdit(c)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.light' }
                          }}
                        >
                          <EditIcon/>
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={()=>handleDelete(c.id)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.light' }
                          }}
                        >
                          <DeleteIcon/>
                        </IconButton>
                      </Stack>
                    )}
                  >
                    <ListItemText 
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" fontWeight={600}>
                            {c.title}
                          </Typography>
                          {c.status && (
                            <Chip 
                              label={c.status} 
                              size="small"
                              color={
                                c.status === 'SOLVED' ? 'success' :
                                c.status === 'INVESTIGATING' ? 'primary' :
                                c.status === 'CLOSED' ? 'default' :
                                c.status === 'COLD_CASE' ? 'error' : 'warning'
                              }
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {c.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                            {c.category && (
                              <Chip 
                                label={c.category} 
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                            {c.severity && (
                              <Chip 
                                label={c.severity} 
                                size="small"
                                color={
                                  c.severity === 'CRITICAL' ? 'error' :
                                  c.severity === 'HIGH' ? 'warning' :
                                  c.severity === 'MEDIUM' ? 'primary' : 'default'
                                }
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                          {c.description && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mt: 0.5
                              }}
                            >
                              {c.description}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < crimes.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={()=>setDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: 40,
                height: 40
              }}
            >
              <GavelIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              {editing ? 'Edit Crime Record' : 'New Crime Record'}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField 
              label="Crime Title" 
              value={form.title} 
              onChange={e=>setForm(f=>({...f, title:e.target.value}))} 
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GavelIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField 
              label="Location" 
              value={form.location} 
              onChange={e=>setForm(f=>({...f, location:e.target.value}))} 
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField 
              label="Date & Time" 
              type="datetime-local" 
              value={form.date} 
              onChange={e=>setForm(f=>({...f, date:e.target.value}))} 
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={form.category}
                    label="Category"
                    onChange={e=>setForm(f=>({...f, category:e.target.value}))}
                  >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="THEFT">Theft</MenuItem>
                    <MenuItem value="ROBBERY">Robbery</MenuItem>
                    <MenuItem value="ASSAULT">Assault</MenuItem>
                    <MenuItem value="MURDER">Murder</MenuItem>
                    <MenuItem value="FRAUD">Fraud</MenuItem>
                    <MenuItem value="CYBERCRIME">Cybercrime</MenuItem>
                    <MenuItem value="KIDNAPPING">Kidnapping</MenuItem>
                    <MenuItem value="DRUG_TRAFFICKING">Drug Trafficking</MenuItem>
                    <MenuItem value="DOMESTIC_VIOLENCE">Domestic Violence</MenuItem>
                    <MenuItem value="VANDALISM">Vandalism</MenuItem>
                    <MenuItem value="BURGLARY">Burglary</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={form.severity}
                    label="Severity"
                    onChange={e=>setForm(f=>({...f, severity:e.target.value}))}
                  >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={form.status}
                    label="Status"
                    onChange={e=>setForm(f=>({...f, status:e.target.value}))}
                  >
                    <MenuItem value="REPORTED">Reported</MenuItem>
                    <MenuItem value="INVESTIGATING">Investigating</MenuItem>
                    <MenuItem value="SOLVED">Solved</MenuItem>
                    <MenuItem value="CLOSED">Closed</MenuItem>
                    <MenuItem value="COLD_CASE">Cold Case</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField 
              label="Description" 
              multiline 
              rows={4} 
              value={form.description} 
              onChange={e=>setForm(f=>({...f, description:e.target.value}))} 
              fullWidth
              placeholder="Enter detailed description of the crime..."
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
            onClick={()=>setDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={loading || !form.title || !form.location}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minWidth: 100,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (editing ? 'Save Changes' : 'Create Crime')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar 
        open={snack.open} 
        autoHideDuration={4000} 
        onClose={()=>setSnack(s=>({...s,open:false}))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={()=>setSnack(s=>({...s,open:false}))} 
          severity={snack.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
