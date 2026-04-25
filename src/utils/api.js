// src/utils/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = async (endpoint, options = {}) => {
  const headers = {
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  };

  // Let browser handle Content-Type for FormData boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Include HTTP-Only cookies for session management
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', 
  });

  if (response.status === 401) {
    localStorage.removeItem('userData');
    
    // HAPUS window.location.href = '/'
    // GANTI dengan memancarkan sinyal (event) ke seluruh aplikasi
    window.dispatchEvent(new Event('auth:unauthorized'));
    
    throw new Error('Session expired. Please log in again.');
  }

  const contentType = response.headers.get('content-type');

  // Handle PDF blob response
  if (contentType && contentType.includes('application/pdf')) {
    if (!response.ok) throw new Error('Failed to download PDF document.');
    return await response.blob(); 
  }

  // Handle standard JSON response
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Server error occurred.');
  }

  return result; 
};