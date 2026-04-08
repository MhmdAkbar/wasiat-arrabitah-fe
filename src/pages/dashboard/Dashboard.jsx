import { useTranslation } from "react-i18next";
import { useDashboard } from "../../hooks/dashboard/useDashboard"; 

export default function Dashboard() {
  const { t } = useTranslation();
  const { recentDocs, stats, loading, role, userName } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-mosque-dark to-mosque-primary p-8 rounded-2xl shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome, {userName}!</h2>
        <p className="text-mosque-light text-sm opacity-90">
          {role === 'admin' || role === 'director' 
            ? 'This is a summary of all document submissions in your organization.' 
            : 'This is a summary of your document submission activities.'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl"><i className="fa-solid fa-file-lines"></i></div>
          <div><p className="text-sm text-gray-500 font-semibold">Total Documents</p><h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4 border-l-4 border-l-orange-500">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-xl"><i className="fa-solid fa-clock-rotate-left"></i></div>
          <div><p className="text-sm text-gray-500 font-semibold">Pending</p><h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-xl"><i className="fa-solid fa-check-double"></i></div>
          <div><p className="text-sm text-gray-500 font-semibold">Approved</p><h3 className="text-2xl font-bold text-gray-800">{stats.approved}</h3></div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800"><i className="fa-solid fa-list text-mosque-primary mr-2"></i> Recent Documents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Document Number</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title / Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="3" className="text-center py-8 text-gray-500"><i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading...</td></tr>
              ) : recentDocs.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-8 text-gray-500">No document activity yet.</td></tr>
              ) : (
                recentDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-mosque-primary">{doc.docNumber}</td>
                    <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-800">{doc.title}</p><p className="text-xs text-gray-500">{doc.formTemplate?.name}</p></td>
                    <td className="px-6 py-4"><span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 rounded-md text-gray-600">{doc.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}