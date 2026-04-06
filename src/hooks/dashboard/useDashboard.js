import { useState } from 'react';
import { api } from '@/utils/api'; // <-- Import Pintu Gerbang Kita

export const useDashboard = () => {
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTestAccess = async () => {
    setLoading(true);
    setApiResponse('> Menghubungi Server...\n');

    try {
      // SANGAT BERSIH! Tidak perlu pusing mikirin URL, Token, Headers, atau cek 401 lagi!
      const data = await api('/api/auth/me', { method: 'GET' });
      
      setApiResponse(`> Status: 200 OK\n\n${JSON.stringify(data, null, 2)}`);
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