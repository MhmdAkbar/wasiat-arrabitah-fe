import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
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

  return (
    <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100">
      <h4 className="text-lg font-bold text-gray-800 mb-1">Area Pengujian API</h4>
      <p className="text-sm text-gray-500 mb-6">Verifikasi token JWT Anda ke endpoint (GET /api/auth/me).</p>
      
      <button 
        onClick={handleTestAccess} 
        disabled={loading}
        className="bg-mosque-dark hover:bg-mosque-primary text-white py-2.5 px-6 rounded-lg shadow-md transition disabled:opacity-70 flex gap-2 items-center"
      >
        <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-network-wired'}`}></i>
        Jalankan Tes Koneksi
      </button>

      {apiResponse && (
        <div className="mt-8">
          <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <pre className="bg-gray-900 text-green-400 p-5 rounded-b-lg overflow-x-auto text-sm font-mono shadow-inner">
            {apiResponse}
          </pre>
        </div>
      )}
    </div>
  );
}