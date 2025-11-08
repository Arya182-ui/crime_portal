import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  CircularProgress, Avatar, Stack, InputAdornment, Chip, Divider, Paper,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
  Search as SearchIcon, People as PeopleIcon, Person as PersonIcon,
  Cake as AgeIcon, Badge as BadgeIcon, Photo as PhotoIcon,
  Description as DescriptionIcon, Clear as ClearIcon, Refresh as RefreshIcon,
  LocationOn as LocationOnIcon, Fingerprint as FingerprintIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createApiClient } from '../services/api';

export default function Criminals(){
  const { idToken } = useAuth();
  const api = createApiClient(idToken);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    name:'', 
    age:'', 
    gender:'',
    alias:'', 
    status:'AT_LARGE',
    dangerLevel:'MEDIUM',
    address:'',
    identificationMarks:'',
    lastSeenLocation:'',
    lastSeenDate:'',
    photoUrl:'' 
  });
  const [query, setQuery] = useState('');

  const load = async (q) => {
    setLoading(true);
    try {
      const resp = await api.get('/criminals', { params: q ? { name: q } : {} });
      setItems(resp.data.items || []);
    } catch (e) {
      console.error('Failed to load criminals', e);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const handleSave = async () => {
    if (!form.name) {
      alert('Name is required');
      return;
    }
    try {
      setLoading(true);
      const payload = { ...form, age: form.age ? Number(form.age) : undefined };
      if (editing && editing.id) {
        await api.put(`/criminals/${editing.id}`, payload);
      } else {
        await api.post('/criminals', payload);
      }
      setOpenDialog(false);
      setEditing(null);
      setForm({ 
        name:'', 
        age:'', 
        gender:'',
        alias:'', 
        status:'AT_LARGE',
        dangerLevel:'MEDIUM',
        address:'',
        identificationMarks:'',
        lastSeenLocation:'',
        lastSeenDate:'',
        photoUrl:'' 
      });
      await load(query);
    } catch (e) {
      console.error(e);
      alert('Failed to save criminal: ' + (e?.response?.data?.error || e.message));
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this criminal record? This action cannot be undone.')) return;
    try {
      setLoading(true);
      await api.delete(`/criminals/${id}`);
      await load(query);
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    } finally { setLoading(false); }
  };

  const handleEditOpen = (item) => {
    setEditing(item);
    setForm({ 
      name: item.name || '', 
      age: item.age || '', 
      gender: item.gender || '',
      alias: item.alias || '', 
      status: item.status || 'AT_LARGE',
      dangerLevel: item.dangerLevel || 'MEDIUM',
      address: item.address || '',
      identificationMarks: item.identificationMarks || '',
      lastSeenLocation: item.lastSeenLocation || '',
      lastSeenDate: item.lastSeenDate || '',
      photoUrl: item.photoUrl || '' 
    });
    setOpenDialog(true);
  };

  const handleCreateNew = () => {
    setEditing(null);
    setForm({ 
      name:'', 
      age:'', 
      gender:'',
      alias:'', 
      status:'AT_LARGE',
      dangerLevel:'MEDIUM',
      address:'',
      identificationMarks:'',
      lastSeenLocation:'',
      lastSeenDate:'',
      photoUrl:'' 
    });
    setOpenDialog(true);
  };

  const handleSearch = () => {
    load(query);
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
              <PeopleIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Criminals Database
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and track known criminal records
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={()=>load(query)} 
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
              onClick={handleCreateNew}
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
              Add Criminal
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Search Bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
          <TextField 
            fullWidth
            value={query} 
            onChange={e=>setQuery(e.target.value)} 
            placeholder="Search by criminal name..." 
            size="small"
            onKeyDown={(e) => { if(e.key === 'Enter' && query) handleSearch(); }}
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setQuery(''); load(); }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={!query}
            sx={{ 
              minWidth: 100,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)'
              }
            }}
          >
            Search
          </Button>
        </Stack>
      </Paper>

      {/* Criminal Cards */}
      {loading ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:8 }}>
          <CircularProgress size={48} />
        </Box>
      ) : items.length === 0 ? (
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
            <PeopleIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Criminals Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {query ? 'Try adjusting your search terms' : 'Add your first criminal record to get started'}
          </Typography>
          {!query && (
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Add First Criminal
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item, index) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {/* Header with Avatar and Actions */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {item.photoUrl ? (
                        <Avatar 
                          src={item.photoUrl}
                          sx={{ width: 64, height: 64 }}
                        >
                          {(item.name || 'N').split(' ').map(s=>s[0]).slice(0,2).join('')}
                        </Avatar>
                      ) : (
                        <Avatar 
                          sx={{ 
                            width: 64, 
                            height: 64,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '1.5rem',
                            fontWeight: 600
                          }}
                        >
                          {(item.name || 'N').split(' ').map(s=>s[0]).slice(0,2).join('')}
                        </Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {item.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                              {item.status && (
                                <Chip 
                                  label={item.status.replace('_', ' ')}
                                  size="small"
                                  color={
                                    item.status === 'AT_LARGE' || item.status === 'WANTED' ? 'error' :
                                    item.status === 'ARRESTED' ? 'warning' :
                                    item.status === 'IN_CUSTODY' ? 'primary' :
                                    item.status === 'CONVICTED' ? 'default' : 'success'
                                  }
                                />
                              )}
                              {item.dangerLevel && (
                                <Chip 
                                  label={item.dangerLevel}
                                  size="small"
                                  icon={<WarningIcon />}
                                  color={
                                    item.dangerLevel === 'CRITICAL' ? 'error' :
                                    item.dangerLevel === 'HIGH' ? 'warning' :
                                    item.dangerLevel === 'MEDIUM' ? 'primary' : 'default'
                                  }
                                />
                              )}
                              {item.age && (
                                <Chip 
                                  label={`${item.age} yrs`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {item.gender && (
                                <Chip 
                                  label={item.gender}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton 
                              size="small"
                              onClick={()=>handleEditOpen(item)}
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.light' }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={()=>handleDelete(item.id)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { bgcolor: 'error.light' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Alias */}
                    {item.alias && (
                      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <BadgeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Known Alias
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {item.alias}
                        </Typography>
                      </Paper>
                    )}

                    {/* Address */}
                    {item.address && (
                      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Address
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {item.address}
                        </Typography>
                      </Paper>
                    )}

                    {/* Identification Marks */}
                    {item.identificationMarks && (
                      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <FingerprintIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Identification Marks
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {item.identificationMarks}
                        </Typography>
                      </Paper>
                    )}

                    {/* Last Seen */}
                    {item.lastSeenLocation && (
                      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'warning.light', color: 'warning.dark' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 18 }} />
                          <Typography variant="caption" fontWeight={600}>
                            Last Seen
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {item.lastSeenLocation}
                        </Typography>
                        {item.lastSeenDate && (
                          <Typography variant="caption">
                            {new Date(item.lastSeenDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Paper>
                    )}

                    {/* Notes - keep backward compatibility */}
                    {item.notes && !item.identificationMarks && !item.alias && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <DescriptionIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Notes
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {item.notes}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={()=>{ setOpenDialog(false); setEditing(null); }} 
        fullWidth 
        maxWidth="sm"
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
              <PeopleIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              {editing ? 'Edit Criminal Record' : 'Add Criminal Record'}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            {/* Basic Information */}
            <TextField 
              label="Full Name" 
              value={form.name} 
              onChange={e=>setForm({...form, name:e.target.value})} 
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                )
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Age" 
                  value={form.age} 
                  onChange={e=>setForm({...form, age:e.target.value})} 
                  fullWidth 
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AgeIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={form.gender}
                    onChange={e=>setForm({...form, gender:e.target.value})}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField 
              label="Alias" 
              value={form.alias} 
              onChange={e=>setForm({...form, alias:e.target.value})} 
              fullWidth
              placeholder="e.g., Johnny D"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                )
              }}
            />

            {/* Status and Danger Level */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={form.status}
                    onChange={e=>setForm({...form, status:e.target.value})}
                    label="Status"
                  >
                    <MenuItem value="AT_LARGE">At Large</MenuItem>
                    <MenuItem value="ARRESTED">Arrested</MenuItem>
                    <MenuItem value="IN_CUSTODY">In Custody</MenuItem>
                    <MenuItem value="CONVICTED">Convicted</MenuItem>
                    <MenuItem value="RELEASED">Released</MenuItem>
                    <MenuItem value="WANTED">Wanted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Danger Level</InputLabel>
                  <Select
                    value={form.dangerLevel}
                    onChange={e=>setForm({...form, dangerLevel:e.target.value})}
                    label="Danger Level"
                    startAdornment={
                      <InputAdornment position="start">
                        <WarningIcon color="warning" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Location Information */}
            <TextField 
              label="Address" 
              value={form.address} 
              onChange={e=>setForm({...form, address:e.target.value})} 
              fullWidth 
              multiline 
              rows={2}
              placeholder="Enter current or last known address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                )
              }}
            />

            <TextField 
              label="Identification Marks" 
              value={form.identificationMarks} 
              onChange={e=>setForm({...form, identificationMarks:e.target.value})} 
              fullWidth 
              multiline 
              rows={2}
              placeholder="e.g., Tattoo on left arm, scar on forehead"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <FingerprintIcon color="action" />
                  </InputAdornment>
                )
              }}
            />

            {/* Last Seen Information */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Last Seen Location" 
                  value={form.lastSeenLocation} 
                  onChange={e=>setForm({...form, lastSeenLocation:e.target.value})} 
                  fullWidth
                  placeholder="City, Area, or specific location"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon color="warning" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Last Seen Date" 
                  value={form.lastSeenDate} 
                  onChange={e=>setForm({...form, lastSeenDate:e.target.value})} 
                  fullWidth
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <TextField 
              label="Photo URL" 
              value={form.photoUrl} 
              onChange={e=>setForm({...form, photoUrl:e.target.value})} 
              fullWidth
              placeholder="https://example.com/photo.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhotoIcon color="action" />
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
            disabled={loading || !form.name}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minWidth: 100,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (editing ? 'Save Changes' : 'Create Record')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
