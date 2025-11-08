import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, Chip, Divider,
  Avatar, List, ListItem, ListItemText, ListItemAvatar, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Skeleton, Alert,
  Tooltip, LinearProgress, Paper, Stack
} from '@mui/material';
import {
  Refresh as RefreshIcon, Gavel as GavelIcon, Report as ReportIcon,
  People as PeopleIcon, ArrowUpward as ArrowUpwardIcon, 
  ArrowDownward as ArrowDownwardIcon, Close as CloseIcon,
  TrendingUp as TrendingUpIcon, Assessment as AssessmentIcon,
  AddCircle as AddCircleIcon, Visibility as VisibilityIcon,
  Schedule as ScheduleIcon, CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createApiClient } from '../services/api';

function StatCard({ title, value, icon, color = 'primary', delta, trend }){
  const gradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
  };

  return (
    <Card 
      component={motion.div}
      whileHover={{ y: -4 }}
      elevation={0}
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        '&:hover': {
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradients[color] || gradients.primary,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ my: 1.5, background: gradients[color], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {value}
            </Typography>
            {delta != null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                {delta > 0 ? (
                  <ArrowUpwardIcon sx={{ fontSize: 18, color: 'success.main' }} />
                ) : delta < 0 ? (
                  <ArrowDownwardIcon sx={{ fontSize: 18, color: 'error.main' }} />
                ) : null}
                <Typography 
                  variant="body2" 
                  fontWeight={700}
                  sx={{ color: delta > 0 ? 'success.main' : delta < 0 ? 'error.main' : 'text.secondary' }}
                >
                  {delta > 0 ? '+' : ''}{delta}% from last week
                </Typography>
              </Box>
            )}
            {trend && trend.length > 0 && (
              <Box sx={{ mt: 2, height: 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color === 'primary' ? '#667eea' : color === 'secondary' ? '#f093fb' : '#4facfe'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={color === 'primary' ? '#667eea' : color === 'secondary' ? '#f093fb' : '#4facfe'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={color === 'primary' ? '#667eea' : color === 'secondary' ? '#f093fb' : '#4facfe'} fill={`url(#gradient-${color})`} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: gradients[color] || gradients.primary,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ title, description, icon, color, onClick }) {
  return (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s',
        height: '100%',
        '&:hover': {
          borderColor: color + '.main',
          boxShadow: 4,
        }
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            bgcolor: color + '.light',
            color: color + '.main',
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard(){
  const { idToken, userRole, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentCrimes, setRecentCrimes] = useState([]);
  const [recentFirs, setRecentFirs] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    if (!idToken) {
      console.log('No token available');
      setError('Not authenticated. Please log in.');
      return;
    }
    console.log('Loading dashboard with token:', idToken?.substring(0, 20) + '...');
    setLoading(true);
    setError(null);
    try {
      const api = createApiClient(idToken);
      const [dashStatsResp, chartsResp, locationsResp, crimesResp, firsResp] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/charts/monthly'),
        api.get('/dashboard/top-locations'),
        api.get('/crimes'),
        api.get('/firs/search')
      ]);
      setStats(dashStatsResp.data || {});
      setMonthlyData(chartsResp.data || []);
      setTopLocations(locationsResp.data || []);
      setRecentCrimes((crimesResp.data.items || []).slice(0,6));
      setRecentFirs((firsResp.data.items || []).slice(0,6));
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to load dashboard data', e);
      console.error('Error response:', e.response);
      setError(e?.response?.data?.error || e.message || 'Failed to load data');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ 
    if (!authLoading && idToken) {
      load();
    }
  }, [idToken, authLoading]);

  // Prepare chart data from monthly API
  const chartData = monthlyData.map(item => ({
    date: item.month,
    crimes: item.crimes || 0,
    firs: item.firs || 0,
    criminals: item.criminals || 0
  }));

  // Prepare trend data for mini charts in stat cards (last 7 data points)
  const recentData = chartData.slice(-7);
  const crimesTrend = recentData.map(d => ({ value: d.crimes }));
  const firsTrend = recentData.map(d => ({ value: d.firs }));
  const criminalsTrend = recentData.map(d => ({ value: d.criminals }));

  // Calculate deltas from stats breakdowns
  const crimesDelta = stats?.crimesBreakdown?.percentageChange || null;
  const firsDelta = stats?.firsBreakdown?.percentageChange || null;
  const criminalsDelta = stats?.criminalsBreakdown?.percentageChange || null;

  // Prepare merged activities
  const activities = [];
  recentCrimes.forEach(c => activities.push({ 
    id: `crime-${c.id}`, 
    type: 'crime', 
    title: c.title, 
    subtitle: c.location, 
    body: c.description, 
    time: c.date || c.createdAt || null, 
    refId: c.id 
  }));
  recentFirs.forEach(f => activities.push({ 
    id: `fir-${f.id}`, 
    type: 'fir', 
    title: `FIR: ${f.complainantName}`, 
    subtitle: f.contact || '', 
    body: f.details, 
    time: f.createdAt || f.date || null, 
    refId: f.id 
  }));
  activities.sort((a,b)=> { 
    const ta = a.time ? new Date(a.time).getTime() : 0; 
    const tb = b.time ? new Date(b.time).getTime() : 0; 
    return tb - ta; 
  });

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)' }}
    >
      {authLoading && <LinearProgress sx={{ mb: 2 }} />}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time crime statistics and activity monitoring
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {lastUpdated && (
              <Chip 
                icon={<ScheduleIcon />}
                label={`Updated ${lastUpdated.toLocaleTimeString()}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={load} 
                disabled={loading || authLoading}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'primary.dark',
                    transform: 'rotate(180deg)',
                    transition: 'all 0.3s'
                  },
                  '&:disabled': { bgcolor: 'action.disabledBackground' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total Crimes" 
            value={loading ? '—' : stats?.totalCrimes ?? 0} 
            icon={<GavelIcon sx={{ fontSize: 28 }} />} 
            color="primary" 
            delta={crimesDelta}
            trend={crimesTrend}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total FIRs" 
            value={loading ? '—' : stats?.totalFirs ?? 0} 
            icon={<ReportIcon sx={{ fontSize: 28 }} />} 
            color="secondary" 
            delta={firsDelta}
            trend={firsTrend}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total Criminals" 
            value={loading ? '—' : stats?.totalCriminals ?? 0} 
            icon={<PeopleIcon sx={{ fontSize: 28 }} />} 
            color="success" 
            delta={criminalsDelta}
            trend={criminalsTrend}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <QuickActionCard
              title="New Crime"
              description="Register a new crime case"
              icon={<AddCircleIcon sx={{ fontSize: 30 }} />}
              color="primary"
              onClick={() => navigate('/crimes')}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <QuickActionCard
              title="File FIR"
              description="Create a new FIR report"
              icon={<ReportIcon sx={{ fontSize: 30 }} />}
              color="secondary"
              onClick={() => navigate('/firs')}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <QuickActionCard
              title="View Criminals"
              description="Browse criminal database"
              icon={<PeopleIcon sx={{ fontSize: 30 }} />}
              color="success"
              onClick={() => navigate('/criminals')}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <QuickActionCard
              title="Analytics"
              description="View detailed reports"
              icon={<TrendingUpIcon sx={{ fontSize: 30 }} />}
              color="warning"
              onClick={() => {}}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Crime Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Card 
            elevation={0}
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon color="primary" />
                    Crime Trends Analysis
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Monthly trends for crimes, FIRs, and criminals
                  </Typography>
                </Box>
                <Chip 
                  label={`${chartData.length} months`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Divider sx={{ mb: 3 }} />
              {loading ? (
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        padding: 12
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="crimes" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      name="Crimes"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="firs" 
                      stroke="#f093fb" 
                      strokeWidth={3}
                      name="FIRs"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="criminals" 
                      stroke="#4facfe" 
                      strokeWidth={3}
                      name="Criminals"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <WarningIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" variant="h6" gutterBottom>
                    No Data Available
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Start adding crime records to see trends
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity Feed */}
        <Grid item xs={12} lg={4}>
          <Card 
            elevation={0}
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Latest updates and reports
                  </Typography>
                </Box>
                <Chip 
                  label={`${activities.length} items`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Stack spacing={2}>
                  <Skeleton height={80} />
                  <Skeleton height={80} />
                  <Skeleton height={80} />
                </Stack>
              ) : activities.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <GavelIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography color="text.secondary" variant="body2">
                    No recent activity
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                  {activities.slice(0, 8).map((act, index) => (
                    <React.Fragment key={act.id}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          py: 1.5,
                          px: 1.5,
                          cursor: 'pointer',
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                          },
                        }}
                        onClick={() => setSelectedActivity(act)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: act.type === 'crime' ? 'primary.main' : 'success.main',
                              width: 36,
                              height: 36,
                            }}
                          >
                            {act.type === 'crime' ? <GavelIcon fontSize="small" /> : <ReportIcon fontSize="small" />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {act.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              {act.subtitle && (
                                <Typography component="span" variant="caption" color="text.primary" display="block" noWrap>
                                  {act.subtitle}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <ScheduleIcon sx={{ fontSize: 12 }} />
                                {act.time ? new Date(act.time).toLocaleString() : 'No date'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < activities.length - 1 && <Divider sx={{ my: 0.5 }} />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Crime Locations */}
        {topLocations.length > 0 && (
          <Grid item xs={12} lg={6}>
            <Card 
              elevation={0}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      📍 Top Crime Locations
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Areas with highest crime activity
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${topLocations.length} locations`}
                    size="small"
                    color="warning"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                {loading ? (
                  <Stack spacing={2}>
                    <Skeleton height={60} />
                    <Skeleton height={60} />
                    <Skeleton height={60} />
                  </Stack>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={topLocations} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis type="number" stroke="#666" fontSize={12} />
                      <YAxis 
                        type="category" 
                        dataKey="location" 
                        stroke="#666" 
                        fontSize={12}
                        width={100}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #e0e0e0',
                          borderRadius: 8,
                          padding: 12
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#f093fb" 
                        name="Crime Reports"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Status Breakdown */}
        {stats?.crimesBreakdown && (
          <Grid item xs={12} lg={6}>
            <Card 
              elevation={0}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      📊 Status Breakdown
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Current case status distribution
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={2}>
                  {stats.crimesBreakdown.byStatus && Object.entries(stats.crimesBreakdown.byStatus).map(([status, count]) => {
                    const total = stats.totalCrimes || 1;
                    const percentage = ((count / total) * 100).toFixed(1);
                    return (
                      <Box key={status}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label={status.replace('_', ' ')} 
                            size="small" 
                            color={
                              status === 'UNDER_INVESTIGATION' ? 'warning' :
                              status === 'SOLVED' ? 'success' :
                              status === 'CLOSED' ? 'default' :
                              'primary'
                            }
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {count} ({percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={parseFloat(percentage)} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'action.hover'
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Admin Panel */}
        {userRole === 'ADMIN' && (
          <Grid item xs={12}>
            <Card 
              component={motion.div}
              whileHover={{ scale: 1.01 }}
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: 'transparent',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => navigate('/users')}
            >
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56 }}>
                        <PeopleIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={800} gutterBottom>
                          👑 Admin Control Panel
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.95 }}>
                          Manage system users, assign roles, and control access permissions
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      startIcon={<PeopleIcon />}
                      sx={{ 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        fontWeight: 700,
                        px: 4,
                        '&:hover': { 
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                      onClick={(e) => { e.stopPropagation(); navigate('/users'); }}
                    >
                      Manage Users
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Activity Detail Dialog */}
      <Dialog 
        open={Boolean(selectedActivity)} 
        onClose={()=> setSelectedActivity(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: { border: '1px solid', borderColor: 'divider', borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: selectedActivity?.type === 'crime' ? 'primary.main' : 'success.main' }}>
              {selectedActivity?.type === 'crime' ? <GavelIcon /> : <ReportIcon />}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>Activity Details</Typography>
          </Box>
          <IconButton onClick={()=> setSelectedActivity(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {selectedActivity && (
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {selectedActivity.type === 'crime' ? 'CRIME REPORT' : 'FIR REPORT'}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                  {selectedActivity.title}
                </Typography>
                {selectedActivity.subtitle && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    📍 {selectedActivity.subtitle}
                  </Typography>
                )}
              </Paper>
              
              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedActivity.body}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedActivity.time ? new Date(selectedActivity.time).toLocaleString() : 'No date available'}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={()=> setSelectedActivity(null)} variant="outlined">
            Close
          </Button>
          {selectedActivity && (
            <Button 
              variant="contained" 
              startIcon={<VisibilityIcon />}
              onClick={()=>{
                if (selectedActivity.type === 'crime') navigate('/crimes');
                else navigate('/firs');
                setSelectedActivity(null);
              }}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600
              }}
            >
              View All {selectedActivity.type === 'crime' ? 'Crimes' : 'FIRs'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
