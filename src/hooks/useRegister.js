import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State Management
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Logika Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');

    const payload = {
      name,
      email,
      password,
      role,
      department: department || null 
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success !== false) {
        alert('Registration successful! Please login.');
        navigate('/');
      } else {
        throw new Error(result.message || result.error || t('auth.register_err'));
      }
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Server Connection Error.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mengembalikan data dan fungsi agar bisa dipakai oleh komponen UI
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