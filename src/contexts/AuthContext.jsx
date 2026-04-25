// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '@/utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Validate session via HTTP-Only cookie on mount
useEffect(() => {
    // Fungsi untuk cek sesi awal
    const checkSession = async () => {
      try {
        const result = await api('/api/auth/me');
        setUser(result.data);
      } catch (error) {
        setUser(null);
        localStorage.removeItem('userData');
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkSession();

    // LISNTENER BARU: Menangkap sinyal 401 dari api.js kapanpun terjadi
    const handleForceLogout = () => {
      setUser(null); // Mengosongkan state akan otomatis memicu ProtectedRoute ke '/'
    };

    window.addEventListener('auth:unauthorized', handleForceLogout);

    // Cleanup saat unmount
    return () => {
      window.removeEventListener('auth:unauthorized', handleForceLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => useContext(AuthContext);