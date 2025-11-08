import React, { useState } from 'react';
import {
  Box, TextField, Button, Grid, Paper, Typography, Snackbar, Alert,
  Stack, Divider, CircularProgress, List, ListItem, ListItemText,
  Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Card, CardContent, InputAdornment, FormControl, InputLabel,
  Select, MenuItem
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Clear as ClearIcon,
  ContentCopy as ContentCopyIcon, OpenInNew as OpenInNewIcon,
  Report as ReportIcon, Person as PersonIcon, Phone as PhoneIcon,
  Description as DescriptionIcon, Gavel as GavelIcon, AccessTime as TimeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createApiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatDate(s) {
  if (!s) return '';
  try { return new Date(s).toLocaleString(); } catch { return s; }
}

export default function FIRs(){
  const { idToken, user } = useAuth();
  const api = createApiClient(idToken);

  const [complainantName, setComplainantName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [crimeId, setCrimeId] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [status, setStatus] = useState('PENDING');

  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });
  const [selectedFir, setSelectedFir] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = async () => {
    if (!complainantName || !contact || !details) {
      setSnack({ open: true, severity: 'warning', message: 'Please fill all required fields' });
      return;
    }
    setLoading(true);
    try {
      const payload = { 
        complainantName, 
        contact, 
        details, 
        crimeId,
        incidentLocation,
        status
      };
      if (incidentDate) {
        payload.incidentDate = new Date(incidentDate).toISOString();
      }
      const resp = await api.post('/firs', payload);
      const newId = resp.data.firId;
      const firNumber = resp.data.firNumber;
      setSnack({ open: true, severity: 'success', message: `FIR created successfully! FIR Number: ${firNumber || newId}` });
      setComplainantName(''); 
      setContact(''); 
      setDetails(''); 
      setCrimeId('');
      setIncidentLocation('');
      setIncidentDate('');
      setStatus('PENDING');
      // refresh list if a search is active
      if (searchName) await handleSearch();
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: 'error', message: e?.response?.data?.message || 'Create failed' });
    } finally { setLoading(false); }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/firs/search', { params: { complainantName: searchName } });
      setResults(resp.data.items || []);
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: 'error', message: 'Search failed' });
    } finally { setLoading(false); }
  };

  const openFirDialog = async (id) => {
    if (!id) return;
    try {
      const resp = await api.get(`/firs/${id}`);
      setSelectedFir(resp.data);
      setDialogOpen(true);
    } catch (e) {
      console.error('Failed to fetch FIR', e);
      setSnack({ open: true, severity: 'error', message: 'Failed to load FIR details' });
    }
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: 48,
              height: 48
            }}
          >
            <ReportIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              FIR Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              File and search First Information Reports
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Create FIR Card */}
        <Grid item xs={12} lg={5}>
          <Card 
            elevation={0} 
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ReportIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  File New FIR
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2.5}>
                <TextField 
                  fullWidth 
                  label="Complainant Name" 
                  value={complainantName} 
                  onChange={e=>setComplainantName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField 
                  fullWidth 
                  label="Contact Number" 
                  value={contact} 
                  onChange={e=>setContact(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField 
                  fullWidth 
                  label="FIR Details" 
                  value={details} 
                  onChange={e=>setDetails(e.target.value)}
                  multiline 
                  rows={4}
                  required
                  placeholder="Describe the incident in detail..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <DescriptionIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField 
                  fullWidth 
                  label="Incident Location" 
                  value={incidentLocation} 
                  onChange={e=>setIncidentLocation(e.target.value)}
                  placeholder="Where did the incident occur?"
                />
                <TextField 
                  fullWidth 
                  label="Incident Date & Time" 
                  type="datetime-local"
                  value={incidentDate} 
                  onChange={e=>setIncidentDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>FIR Status</InputLabel>
                  <Select
                    value={status}
                    label="FIR Status"
                    onChange={e=>setStatus(e.target.value)}
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="REGISTERED">Registered</MenuItem>
                    <MenuItem value="INVESTIGATING">Investigating</MenuItem>
                    <MenuItem value="EVIDENCE_COLLECTED">Evidence Collected</MenuItem>
                    <MenuItem value="CHARGE_SHEET_FILED">Charge Sheet Filed</MenuItem>
                    <MenuItem value="CLOSED">Closed</MenuItem>
                  </Select>
                </FormControl>
                <TextField 
                  fullWidth 
                  label="Related Crime ID (Optional)" 
                  value={crimeId} 
                  onChange={e=>setCrimeId(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GavelIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                
                <Button
                  fullWidth
                  size="large"
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={handleCreate}
                  disabled={!user || loading || !complainantName || !contact || !details}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'File FIR'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Search & Results Card */}
        <Grid item xs={12} lg={7}>
          <Card 
            elevation={0} 
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SearchIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Search FIRs
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Search Bar */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 3 }}>
                <TextField 
                  fullWidth
                  size="small"
                  placeholder="Search by complainant name..." 
                  value={searchName} 
                  onChange={e=>setSearchName(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && searchName) handleSearch(); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSearch} 
                  disabled={loading || !searchName}
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
                <Button 
                  variant="outlined" 
                  startIcon={<ClearIcon />}
                  onClick={()=>{ setSearchName(''); setResults([]); }} 
                  disabled={loading}
                >
                  Clear
                </Button>
              </Stack>

              {/* Results */}
              <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p:4 }}>
                    <CircularProgress />
                  </Box>
                )}

                {!loading && results.length === 0 && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 6,
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
                      <ReportIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No FIRs Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchName ? 'Try adjusting your search terms' : 'Enter a complainant name to search'}
                    </Typography>
                  </Box>
                )}

                {!loading && results.length > 0 && (
                  <List sx={{ p: 0 }}>
                    {results.map((r, index) => (
                      <React.Fragment key={r.id}>
                        <ListItem 
                          alignItems="flex-start"
                          sx={{
                            mb: 1,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                          onClick={()=>openFirDialog(r.id)}
                          secondaryAction={
                            <IconButton 
                              edge="end"
                              onClick={(e)=>{ e.stopPropagation(); openFirDialog(r.id); }}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          }
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main', 
                              mr: 2,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                          >
                            {(r.complainantName || 'U').slice(0,1).toUpperCase()}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {r.complainantName}
                                </Typography>
                                {r.firNumber && (
                                  <Chip 
                                    label={r.firNumber} 
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                )}
                                {r.status && (
                                  <Chip 
                                    label={r.status} 
                                    size="small"
                                    color={
                                      r.status === 'CLOSED' ? 'default' :
                                      r.status === 'CHARGE_SHEET_FILED' ? 'success' :
                                      r.status === 'INVESTIGATING' || r.status === 'EVIDENCE_COLLECTED' ? 'primary' :
                                      r.status === 'REGISTERED' ? 'info' : 'warning'
                                    }
                                  />
                                )}
                                <Typography component="span" variant="caption" color="text.secondary">
                                  {r.contact}
                                </Typography>
                              </Stack>
                            }
                            secondary={
                              <Stack spacing={1} sx={{ mt: 0.5 }}>
                                {r.incidentLocation && (
                                  <Typography variant="body2" color="text.secondary">
                                    📍 {r.incidentLocation}
                                  </Typography>
                                )}
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {r.details}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                  {r.crimeId && (
                                    <Chip 
                                      size="small" 
                                      label={`Crime: ${r.crimeId}`}
                                      color="primary"
                                      variant="outlined"
                                    />
                                  )}
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(r.createdAt)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Stack>
                            }
                          />
                        </ListItem>
                        {index < results.length - 1 && <Divider sx={{ my: 1 }} />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FIR Details Dialog */}
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
              <ReportIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              FIR Details
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {selectedFir ? (
            <Stack spacing={2}>
              {selectedFir.firNumber && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <Typography variant="caption" fontWeight={600}>
                    FIR NUMBER
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                    {selectedFir.firNumber}
                  </Typography>
                </Paper>
              )}

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary">
                  Complainant Information
                </Typography>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                  {selectedFir.complainantName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📞 {selectedFir.contact}
                </Typography>
              </Paper>

              {selectedFir.incidentLocation && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                  <Typography variant="caption" color="text.secondary">
                    Incident Location
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    📍 {selectedFir.incidentLocation}
                  </Typography>
                  {selectedFir.incidentDate && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      🕐 {formatDate(selectedFir.incidentDate)}
                    </Typography>
                  )}
                </Paper>
              )}

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Incident Details
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {selectedFir.details}
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedFir.status && (
                  <Chip 
                    label={selectedFir.status}
                    color={
                      selectedFir.status === 'CLOSED' ? 'default' :
                      selectedFir.status === 'CHARGE_SHEET_FILED' ? 'success' :
                      selectedFir.status === 'INVESTIGATING' || selectedFir.status === 'EVIDENCE_COLLECTED' ? 'primary' :
                      selectedFir.status === 'REGISTERED' ? 'info' : 'warning'
                    }
                  />
                )}
                {selectedFir.crimeId ? (
                  <Chip 
                    label={`Related Crime: ${selectedFir.crimeId}`}
                    color="primary"
                    icon={<GavelIcon />}
                    variant="outlined"
                  />
                ) : (
                  <Chip 
                    label="No related crime"
                    variant="outlined"
                  />
                )}
                <Chip 
                  label={`Filed: ${formatDate(selectedFir.createdAt)}`}
                  icon={<TimeIcon />}
                  variant="outlined"
                />
              </Box>

              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary">
                  FIR ID: {selectedFir.id}
                </Typography>
              </Paper>
            </Stack>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p:2 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            startIcon={<ContentCopyIcon />}
            onClick={()=>{ 
              navigator.clipboard?.writeText(selectedFir?.id || ''); 
              setSnack({ open:true, severity:'success', message:'FIR ID copied to clipboard' }); 
            }}
            variant="outlined"
          >
            Copy ID
          </Button>
          <Button onClick={()=>setDialogOpen(false)} variant="contained">
            Close
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

