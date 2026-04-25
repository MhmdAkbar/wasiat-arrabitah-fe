// src/hooks/auth/useLogout.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Connect to global state

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Instruct backend to clear the HTTP-Only cookie
      await api('/api/auth/logout', { method: 'POST' });
      
      // Clear client-side data and state
      localStorage.removeItem('userData');
      setUser(null);
      
      toast.success('Logged out successfully.');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to logout.');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading };
};