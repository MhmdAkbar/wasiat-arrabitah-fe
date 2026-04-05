import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDashboard = () => {
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTestAccess = async () => {
    setLoading(true);
    setApiResponse('> Menghubungi Server...\n');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      setApiResponse(`> Status: ${response.status}\n\n${JSON.stringify(data, null, 2)}`);

      if (!response.ok && response.status === 401) {
        alert('Sesi habis. Silakan login kembali.');
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      setApiResponse(`> Error:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    apiResponse,
    loading,
    handleTestAccess
  };
};