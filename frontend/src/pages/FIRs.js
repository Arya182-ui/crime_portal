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
  Description as DescriptionIcon, Gavel as GavelIcon, AccessTime as TimeIcon,
  Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon,
  Refresh as RefreshIcon, List as ListIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createApiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatDate(s) {
  if (!s) return '';
  try { return new Date(s).toLocaleString(); } catch { return s; }
}

export default function FIRs(){
  const { idToken, user, userRole } = useAuth();
  const api = createApiClient(idToken);

  const [complainantName, setComplainantName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [crimeId, setCrimeId] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [status, setStatus] = useState('PENDING');

  const [searchName, setSearchName] = useState('');
  const [searchFirNumber, setSearchFirNumber] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name' or 'firNumber'
  const [results, setResults] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });
  const [selectedFir, setSelectedFir] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedStatus, setEditedStatus] = useState('PENDING');

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
      
      // Add newly created FIR to results immediately
      const newFir = {
        id: newId,
        firId: newId,
        firNumber: firNumber,
        complainantName: complainantName,
        contact: contact,
        details: details,
        crimeId: crimeId || null,
        incidentLocation: incidentLocation || null,
        incidentDate: incidentDate ? new Date(incidentDate).toISOString() : new Date().toISOString(),
        status: status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to top of results
      setResults(prevResults => [newFir, ...prevResults]);
      
      // Clear form
      setComplainantName(''); 
      setContact(''); 
      setDetails(''); 
      setCrimeId('');
      setIncidentLocation('');
      setIncidentDate('');
      setStatus('PENDING');
      
      // Also refresh the search results to get latest data from Firebase
      if (searchName) {
        setTimeout(() => handleSearch(), 500);
      }
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: 'error', message: e?.response?.data?.message || 'Create failed' });
    } finally { setLoading(false); }
  };

  const handleSearch = async () => {
    // Validation: Minimum 3 characters for name search, exact FIR number for FIR search
    if (searchType === 'name') {
      if (searchName.trim().length < 3) {
        setSnack({ open: true, severity: 'warning', message: 'Please enter at least 3 characters to search' });
        return;
      }
    } else if (searchType === 'firNumber') {
      if (searchFirNumber.trim().length === 0) {
        setSnack({ open: true, severity: 'warning', message: 'Please enter FIR Number' });
        return;
      }
    }

    setLoading(true);
    try {
      const params = {};
      if (searchType === 'name') {
        params.complainantName = searchName.trim();
      } else if (searchType === 'firNumber') {
        params.firNumber = searchFirNumber.trim();
      }
      
      const resp = await api.get('/firs/search', { params });
      setResults(resp.data.items || []);
      setShowAll(false);
      
      if (resp.data.items?.length === 0) {
        setSnack({ open: true, severity: 'info', message: 'No FIRs found matching your search' });
      }
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: 'error', message: 'Search failed' });
    } finally { setLoading(false); }
  };

  const loadAllFirs = async () => {
    setLoading(true);
    setSearchName('');
    setSearchFirNumber('');
    try {
      const resp = await api.get('/firs', { params: { limit: 100 } });
      setResults(resp.data.items || []);
      setShowAll(true);
      setSnack({ open: true, severity: 'success', message: `Loaded ${resp.data.items?.length || 0} FIRs` });
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: 'error', message: 'Failed to load FIRs' });
    } finally { setLoading(false); }
  };

  // Auto-load all FIRs for Admin/Officers on mount
  React.useEffect(() => {
    if (userRole === 'ADMIN' || userRole === 'OFFICER') {
      loadAllFirs();
    }
  }, [userRole]);

  const openFirDialog = async (id) => {
    if (!id) return;
    try {
      const resp = await api.get(`/firs/${id}`);
      setSelectedFir(resp.data);
      setEditedStatus(resp.data.status || 'PENDING');
      setEditMode(false);
      setDialogOpen(true);
    } catch (e) {
      console.error('Failed to fetch FIR', e);
      setSnack({ open: true, severity: 'error', message: 'Failed to load FIR details' });
    }
  };

  const handleUpdateFir = async () => {
    if (!selectedFir) return;
    setLoading(true);
    try {
      await api.put(`/firs/${selectedFir.id}`, { status: editedStatus });
      setSnack({ open: true, severity: 'success', message: 'FIR updated successfully!' });
      
      // Update in results list
      setResults(prevResults => 
        prevResults.map(r => r.id === selectedFir.id ? {...r, status: editedStatus} : r)
      );
      
      // Update selected FIR
      setSelectedFir({...selectedFir, status: editedStatus});
      setEditMode(false);
      
      // Refresh if search active
      if (searchName) {
        setTimeout(() => handleSearch(), 500);
      }
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: 'error', message: 'Failed to update FIR' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFir = async () => {
    if (!selectedFir) return;
    if (!window.confirm(`Are you sure you want to delete FIR ${selectedFir.firNumber || selectedFir.id}?`)) {
      return;
    }
    setLoading(true);
    try {
      await api.delete(`/firs/${selectedFir.id}`);
      setSnack({ open: true, severity: 'success', message: 'FIR deleted successfully!' });
      
      // Remove from results list
      setResults(prevResults => prevResults.filter(r => r.id !== selectedFir.id));
      
      setDialogOpen(false);
      setSelectedFir(null);
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: 'error', message: 'Failed to delete FIR' });
    } finally {
      setLoading(false);
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
                
                {/* Status info - not editable by user */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 1.5,
                    bgcolor: 'info.lighter',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'info.light'
                  }}
                >
                  <ReportIcon fontSize="small" color="info" />
                  New FIR will be created with <strong>PENDING</strong> status. Admin/Officer will update it later.
                </Typography>
                
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SearchIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    {showAll ? 'All FIRs' : 'Search FIRs'}
                  </Typography>
                  {showAll && (
                    <Chip 
                      label={`${results.length} FIRs`} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                {(userRole === 'ADMIN' || userRole === 'OFFICER') && (
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={loadAllFirs}
                    disabled={loading}
                    variant="outlined"
                  >
                    Refresh
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* Search Type Selector */}
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label="Search by Name"
                  onClick={() => setSearchType('name')}
                  color={searchType === 'name' ? 'primary' : 'default'}
                  variant={searchType === 'name' ? 'filled' : 'outlined'}
                  icon={<PersonIcon />}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Search by FIR Number"
                  onClick={() => setSearchType('firNumber')}
                  color={searchType === 'firNumber' ? 'primary' : 'default'}
                  variant={searchType === 'firNumber' ? 'filled' : 'outlined'}
                  icon={<ReportIcon />}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>

              {/* Search Bar */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 3 }}>
                {searchType === 'name' ? (
                  <TextField 
                    fullWidth
                    size="small"
                    placeholder="Enter complainant name (min 3 characters)..." 
                    value={searchName} 
                    onChange={e=>setSearchName(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && searchName.length >= 3) handleSearch(); }}
                    helperText="Minimum 3 characters required"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                ) : (
                  <TextField 
                    fullWidth
                    size="small"
                    placeholder="Enter complete FIR Number (e.g., FIR1234567890)..." 
                    value={searchFirNumber} 
                    onChange={e=>setSearchFirNumber(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && searchFirNumber) handleSearch(); }}
                    helperText="Enter full FIR number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReportIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                <Button 
                  variant="contained" 
                  onClick={handleSearch} 
                  disabled={loading || (searchType === 'name' ? searchName.length < 3 : !searchFirNumber)}
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
                {(userRole === 'ADMIN' || userRole === 'OFFICER') && (
                  <Button 
                    variant="outlined" 
                    startIcon={<ListIcon />}
                    onClick={loadAllFirs} 
                    disabled={loading}
                    color="primary"
                  >
                    All FIRs
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  startIcon={<ClearIcon />}
                  onClick={()=>{ 
                    setSearchName(''); 
                    setSearchFirNumber('');
                    setResults([]); 
                    setShowAll(false); 
                  }} 
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
                      {showAll 
                        ? 'No FIRs available in the system' 
                        : (searchName || searchFirNumber)
                          ? 'No FIRs found matching your search' 
                          : (userRole === 'ADMIN' || userRole === 'OFFICER') 
                            ? 'Click "All FIRs" to view all FIRs or search using name/FIR number' 
                            : 'Search by complainant name (min 3 chars) or FIR number'
                      }
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
                  editMode && (userRole === 'ADMIN' || userRole === 'OFFICER') ? (
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={editedStatus}
                        label="Status"
                        onChange={(e) => setEditedStatus(e.target.value)}
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="REGISTERED">Registered</MenuItem>
                        <MenuItem value="INVESTIGATING">Investigating</MenuItem>
                        <MenuItem value="EVIDENCE_COLLECTED">Evidence Collected</MenuItem>
                        <MenuItem value="CHARGE_SHEET_FILED">Charge Sheet Filed</MenuItem>
                        <MenuItem value="CLOSED">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip 
                      label={selectedFir.status}
                      color={
                        selectedFir.status === 'CLOSED' ? 'default' :
                        selectedFir.status === 'CHARGE_SHEET_FILED' ? 'success' :
                        selectedFir.status === 'INVESTIGATING' || selectedFir.status === 'EVIDENCE_COLLECTED' ? 'primary' :
                        selectedFir.status === 'REGISTERED' ? 'info' : 'warning'
                      }
                    />
                  )
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
          {editMode ? (
            <>
              <Button 
                startIcon={<CancelIcon />}
                onClick={() => {
                  setEditMode(false);
                  setEditedStatus(selectedFir?.status || 'PENDING');
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button 
                startIcon={<SaveIcon />}
                onClick={handleUpdateFir}
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
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
              
              {(userRole === 'ADMIN' || userRole === 'OFFICER') && (
                <>
                  <Button 
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    variant="outlined"
                    color="primary"
                  >
                    Edit
                  </Button>
                  {userRole === 'ADMIN' && (
                    <Button 
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteFir}
                      variant="outlined"
                      color="error"
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
              
              <Button 
                onClick={()=>{
                  setDialogOpen(false);
                  setEditMode(false);
                }} 
                variant="contained"
              >
                Close
              </Button>
            </>
          )}
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

