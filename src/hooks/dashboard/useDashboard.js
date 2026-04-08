import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api'; 

export const useDashboard = () => {
  const [recentDocs, setRecentDocs] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(false);
  
  const role = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      // SMART LOGIC: Admin/Director fetch from Global (/all), the rest fetch from Personal (/my)
      if (role === 'admin' || role === 'director') {
        result = await api('/api/submissions/all?limit=5'); // Fetch only 5 latest for dashboard
      } else {
        result = await api('/api/submissions/my');
      }

      if (result.success) {
        const data = role === 'admin' || role === 'director' ? result.data : result.data.slice(0, 5);
        setRecentDocs(data);

        // Simulate simple statistics calculation from the fetched data
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