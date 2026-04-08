// src/utils/api.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // SANGAT PENTING: Jika body adalah FormData (upload file), JANGAN set Content-Type ke JSON
  // Biarkan browser yang mengatur Content-Type menjadi multipart/form-data beserta boundary-nya
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/'; 
    throw new Error('Sesi habis. Silakan login kembali.');
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Terjadi kesalahan pada server');
  }

  return result; 
};