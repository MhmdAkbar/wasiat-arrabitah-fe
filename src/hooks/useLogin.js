import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        const token = result.data.token;
        const user = result.data.user;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userName', user.name); 
          localStorage.setItem('userRole', user.role);
          
          navigate('/dashboard');
        } else {
          throw new Error('Login berhasil, tapi token tidak ditemukan di JSON.');
        }
      } else {
        throw new Error(result.message || t('auth.login_err'));
      }
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Koneksi ke Server Gagal (Backend Mati/CORS).' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    loading, error,
    handleLogin
  };
};