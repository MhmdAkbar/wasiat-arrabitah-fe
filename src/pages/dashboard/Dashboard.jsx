import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // <-- Added Link
import { useDashboard } from "../../hooks/dashboard/useDashboard"; 

export default function Dashboard() {
  const { t } = useTranslation();
  const { recentDocs, stats, loading, role, userName } = useDashboard();

  // Smart function to generate name initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner - NOW MUCH MORE INTERACTIVE */}
      <div className="bg-linear-to-r from-mosque-dark to-mosque-primary p-5 sm:p-8 rounded-2xl shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative overflow-hidden">
        
        {/* Transparent Background Decoration */}
        <div className="absolute -right-8 -top-8 text-white opacity-10 pointer-events-none">
           <i className="fa-solid fa-mosque" style={{ fontSize: '14rem' }}></i>
        </div>

        {/* Welcome Text Area */}
        <div className="relative z-10 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 break-words">Welcome, {userName}!</h2>
          <p className="text-mosque-light text-sm opacity-90 max-w-xl">
            {role === 'admin' || role === 'director' 
              ? 'This is a summary of all document submissions in your organization.' 
              : 'This is a summary of your document submission activities.'}
          </p>
        </div>

        {/* PROFILE AVATAR BUTTON (NEW AREA) */}
        <Link 
          to="/my-profile" 
          className="group relative z-10 flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-md hover:shadow-xl mt-4 md:mt-0 self-start md:self-auto"
          title="Go to My Profile"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-tight group-hover:text-mosque-gold transition-colors">{userName}</p>
            <p className="text-xs text-mosque-light uppercase tracking-wider">{role}</p>
          </div>
          {/* shrink-0 ensures the avatar circle doesn't get squeezed into an oval on small screens */}
          <div className="w-14 h-14 shrink-0 rounded-full bg-mosque-gold text-mosque-dark flex items-center justify-center text-xl font-black shadow-inner group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-white">
            {getInitials(userName)}
          </div>
          
          {/* Small Tooltip Badge for clarity */}
          <div className="absolute -bottom-3 right-1 sm:-right-2 bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap">
            <i className="fa-solid fa-pen mr-1"></i> My Profile
          </div>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="w-12 h-12 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl"><i className="fa-solid fa-file-lines"></i></div>
          <div><p className="text-sm text-gray-500 font-semibold">Total Documents</p><h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3></div>
        </div>
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4 border-l-4 border-l-orange-500">
          <div className="w-12 h-12 shrink-0 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-xl"><i className="fa-solid fa-clock-rotate-left"></i></div>
          <div><p className="text-sm text-gray-500 font-semibold">Pending</p><h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3></div>
        </div>
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-soft border border-gray-100 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="w-12 h-12 shrink-0 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-xl"><i className="fa-solid fa-check-double"></i></div>
          <div><p className="text-sm text-gray-500 font-semibold">Approved</p><h3 className="text-2xl font-bold text-gray-800">{stats.approved}</h3></div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800"><i className="fa-solid fa-list text-mosque-primary mr-2"></i> Recent Documents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-full">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Document Number</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Title / Type</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Status</th>
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
                    <td className="px-4 sm:px-6 py-4 text-sm font-mono text-mosque-primary whitespace-nowrap">{doc.docNumber}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">{doc.title}</p>
                      <p className="text-xs text-gray-500">{doc.formTemplate?.name}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 rounded-md text-gray-600">{doc.status}</span>
                    </td>
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