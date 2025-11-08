import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShieldIcon from '@mui/icons-material/Shield';
import { ThemeModeContext } from '../index';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header(){
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = React.useContext(ThemeModeContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Crimes', path: '/crimes', icon: <GavelIcon /> },
    { label: 'FIRs', path: '/firs', icon: <DescriptionIcon /> },
    { label: 'Criminals', path: '/criminals', icon: <PeopleIcon /> },
  ];

  if (userRole === 'ADMIN') {
    navItems.push({ label: 'Users', path: '/users', icon: <AdminPanelSettingsIcon /> });
  }

  const isActive = (path) => location.pathname === path;

  // If not logged in, show simple header
  if (!user) {
    return (
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 0.5 }}>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              cursor: 'pointer',
              flexGrow: 1
            }}
            onClick={() => navigate('/login')}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Crime Portal Logo"
              sx={{
                height: 40,
                width: 40,
                objectFit: 'contain',
              }}
            />
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  fontSize: '1.1rem'
                }}
              >
                Crime Portal
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.85,
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                }}
              >
                MANAGEMENT SYSTEM
              </Typography>
            </Box>
          </Box>

          {/* Theme Toggle */}
          <IconButton 
            color="inherit" 
            onClick={toggleMode} 
            size="small"
            sx={{ 
              mr: 1,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>

          {/* Auth Buttons */}
          {location.pathname !== '/login' && (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              size="small"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid',
                mr: 1,
                px: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Login
            </Button>
          )}
          {location.pathname !== '/register' && (
            <Button 
              component={Link} 
              to="/register"
              size="small"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Register
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }

  // Mobile drawer
  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              height: 32,
              width: 32,
              objectFit: 'contain',
            }}
          />
          Crime Portal
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Mobile Menu Icon */}
          {user && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              cursor: 'pointer',
              flexGrow: { xs: 1, md: 0 }
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Crime Portal Logo"
              sx={{
                height: 40,
                width: 40,
                objectFit: 'contain',
              }}
            />
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                Crime Portal
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                }}
              >
                MANAGEMENT SYSTEM
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {user && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 4, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: 'white',
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: isActive(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none',
                    border: isActive(item.path) ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: { xs: 0, md: user ? 0 : 1 } }} />

          {/* Theme Toggle */}
          <IconButton 
            color="inherit" 
            onClick={toggleMode} 
            sx={{ 
              ml: 1,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Auth Buttons */}
          {!user && (
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}

          {/* User Avatar Menu */}
          {user && (
            <>
              <IconButton 
                onClick={handleMenuOpen} 
                sx={{ 
                  ml: 2,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  p: 0.3,
                  '&:hover': {
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-dot': {
                      bgcolor: 'success.main',
                      boxShadow: '0 0 0 2px',
                    },
                  }}
                >
                  <Avatar 
                    src={user?.photoURL} 
                    sx={{ 
                      width: 38, 
                      height: 38,
                      border: '2px solid white',
                    }}
                  >
                    {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                  </Avatar>
                </Badge>
              </IconButton>
              
              <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 2,
                    overflow: 'hidden',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user?.displayName || user?.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userRole || 'User'}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem 
                  onClick={() => { handleMenuClose(); navigate('/profile'); }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                {userRole === 'ADMIN' && (
                  <MenuItem 
                    onClick={() => { handleMenuClose(); navigate('/settings'); }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                )}
                <Divider />
                <MenuItem 
                  onClick={() => { handleMenuClose(); handleLogout(); }}
                  sx={{ py: 1.5, color: 'error.main' }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRadius: '0 16px 16px 0',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
