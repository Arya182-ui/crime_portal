import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import axios from 'axios';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setProfileError(false);
      setUserStatus(null);
      setStatusMessage(null);
      
      if (u) {
        try {
          const token = await u.getIdToken();
          setIdToken(token);
          
          // Get role from token claims
          const tokenResult = await u.getIdTokenResult();
          setUserRole(tokenResult.claims.role || null);
          
          // Check profile status
          try {
            const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            const statusResponse = await axios.get(
              `${apiBase}/api/auth/profile/status`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const status = statusResponse.data.status;
            setUserStatus(status);
            console.log('✅ Profile status:', status);
            
            // If status is PENDING or REJECTED, set appropriate message
            if (status === 'PENDING') {
              setStatusMessage('Your account is pending admin approval.');
            } else if (status === 'REJECTED') {
              setStatusMessage('Your account has been rejected. Please contact support.');
            } else if (status === 'APPROVED' || !status) {
              // APPROVED or no status (for existing admin accounts)
              setUserStatus('APPROVED');
            }
            
          } catch (profileErr) {
            console.error('⚠️ Profile status check failed:', profileErr.response?.status);
            
            // If profile doesn't exist (401 or 404), try to create it
            if (profileErr.response?.status === 401 || profileErr.response?.status === 404) {
              console.log('🔄 Attempting to create profile...');
              try {
                const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:8080';
                await axios.post(
                  `${apiBase}/api/auth/profile`,
                  { 
                    name: u.displayName || u.email?.split('@')[0] || 'User',
                    email: u.email 
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log('✅ Profile created successfully');
                setUserStatus('PENDING');
                setStatusMessage('Your account is pending admin approval.');
              } catch (createErr) {
                console.error('❌ Profile creation failed:', createErr.response?.status);
                setProfileError(true);
              }
            } else {
              // For other errors (like existing admin without status field), allow access
              console.log('ℹ️ Assuming legacy account with full access');
              setUserStatus('APPROVED');
            }
          }
        } catch (error) {
          console.error('❌ Auth context error:', error);
          setProfileError(true);
        }
      } else {
        setIdToken(null);
        setUserRole(null);
        setUserStatus(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setProfileError(false);
    setUserStatus(null);
    setStatusMessage(null);
  };

  return (
    <AuthContext.Provider value={{ user, idToken, userRole, userStatus, statusMessage, loading, logout, profileError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
