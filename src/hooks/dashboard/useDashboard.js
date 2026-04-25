// src/hooks/dashboard/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api'; 
import { useAuth } from '@/contexts/AuthContext';

export const useDashboard = () => {
  const [recentDocs, setRecentDocs] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(false);
  
  // Consume reactive user data from context
  const { user } = useAuth();
  const role = user?.role;
  const userName = user?.name;

  const fetchDashboardData = useCallback(async () => {
    if (!role) return; // Prevent fetch if user data is not yet loaded

    setLoading(true);
    try {
      let result;
      // Smart routing based on role
      if (role === 'admin' || role === 'director') {
        result = await api('/api/submissions/all?limit=5'); 
      } else {
        result = await api('/api/submissions/my');
      }

      if (result.success) {
        const data = role === 'admin' || role === 'director' ? result.data : result.data.slice(0, 5);
        setRecentDocs(data);

        // Simple statistics
        const total = result.meta ? result.meta.totalItems : result.data.length;
        const pending = result.data.filter(d => d.status === 'submitted' || d.status === 'in_progress').length;
        const approved = result.data.filter(d => d.status === 'approved').length;
        
        setStats({ total, pending, approved });
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { recentDocs, stats, loading, role, userName };
};