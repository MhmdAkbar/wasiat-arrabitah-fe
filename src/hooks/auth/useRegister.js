// src/hooks/auth/useRegister.js
import { useState } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export const useRegister = () => {
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
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      toast.success('User registered successfully.');
      // Reset form instead of navigating to root (since this is admin only now)
      setName(''); setEmail(''); setPassword('');
    } catch (err) {
      // Handle privilege escalation prevention error from backend
      if (err.message.includes('403')) {
        setError('Insufficient permission to create this role level.');
        toast.error('Privilege error: Cannot create higher/equal level accounts.');
      } else {
        setError(err.message === 'Failed to fetch' ? 'Server Connection Error.' : err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName, email, setEmail, password, setPassword,
    department, setDepartment, role, setRole, loading, error, handleRegister
  };
};