import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/utils/api';

export const useRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');

    const payload = { name, email, password, role, department: department || null };

    try {
      // Pintu gerbang otomatis menangani header dan error jika status bukan 2xx
      const result = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Server Connection Error.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    department, setDepartment,
    role, setRole,
    loading, error,
    handleRegister
  };
};