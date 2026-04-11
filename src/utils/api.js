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

  // Jika body adalah FormData (upload file/signature), biarkan browser mengatur Content-Type otomatis
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

  // Cek Tipe Konten dari Response Backend
  const contentType = response.headers.get('content-type');

  // JIKA RESPONSE ADALAH FILE PDF (Untuk fitur Cetak Dokumen)
  if (contentType && contentType.includes('application/pdf')) {
    if (!response.ok) throw new Error('Failed to download PDF documents.');
    return await response.blob(); 
  }

  // JIKA RESPONSE ADALAH JSON BISA (Standar API kita)
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Terjadi kesalahan pada server');
  }

  return result; 
};