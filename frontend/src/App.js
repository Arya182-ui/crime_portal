import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Crimes from './pages/Crimes';
import FIRs from './pages/FIRs';
import Criminals from './pages/Criminals';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Documentation from './pages/Documentation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Support from './pages/Support';
import OurTeam from './pages/OurTeam';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/support" element={<Support />} />
          <Route path="/team" element={<OurTeam />} />

          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/crimes" element={<ProtectedRoute><Crimes/></ProtectedRoute>} />
          <Route path="/firs" element={<ProtectedRoute><FIRs/></ProtectedRoute>} />
          <Route path="/criminals" element={<ProtectedRoute><Criminals/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/users" element={<AdminRoute><Users/></AdminRoute>} />
          <Route path="/settings" element={<AdminRoute><Settings/></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Box>
      <Footer />
    </Box>
  );
}
