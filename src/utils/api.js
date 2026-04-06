// src/utils/api.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  // Setup default headers (Auto-inject ngrok warning bypass & JSON type)
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  };

  // Auto-inject Token jika user sudah login
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Global Error Handling: Jika sesi habis (401 Unauthorized)
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/'; // Lempar kembali ke halaman login
    throw new Error('Sesi habis. Silakan login kembali.');
  }

  const result = await response.json();

  // Mempermudah penanganan error di sisi Hook (Langsung lempar error jika success: false)
  if (!response.ok) {
    throw new Error(result.message || 'Terjadi kesalahan pada server');
  }

  return result; // Langsung mengembalikan data JSON yang bersih
};