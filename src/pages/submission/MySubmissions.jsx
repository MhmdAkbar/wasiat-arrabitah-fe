// src/pages/submission/MySubmissions.jsx
import { useTranslation } from 'react-i18next';
import { useMySubmissions } from '../../hooks/submission/useMySubmissions';
import DocumentDetailModal from '../../components/organisms/submission/DocumentDetailModal';

export default function MySubmissions() {
  const { t } = useTranslation();
  const { 
    submissions, 
    loading, 
    error, 
    detailData, 
    detailLoading, 
    fetchDetail, 
    clearDetail,
    cancelSubmission, // Destructure the cancel function from the hook
    resubmitSubmission
  } = useMySubmissions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('submission.my_list')}</h2>
          <p className="text-sm text-gray-500">{t('submission.my_list_desc')}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 transition-all">
          <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.doc_no')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.form_type')} / Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.status')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.date')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t('submission.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin mr-2 text-mosque-primary"></i> 
                    Loading data...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    You have never submitted a document.
                  </td>
                </tr>
              ) : (
                submissions.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-mosque-primary font-medium">{doc.docNumber}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800 font-semibold">{doc.title}</p>
                      <p className="text-xs text-gray-500">{doc.formTemplate.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        doc.status === 'submitted' ? 'bg-blue-100 text-blue-700' : 
                        doc.status === 'returned' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button 
                        onClick={() => fetchDetail(doc.id)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-mosque-primary hover:text-white rounded text-xs font-bold transition-all flex items-center gap-1.5 ml-auto"
                      >
                        <i className="fa-solid fa-eye"></i> {t('submission.view_detail')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Detail Modal */}
      <DocumentDetailModal 
        isOpen={!!detailData || detailLoading} 
        onClose={clearDetail} 
        detailData={detailData} 
        loading={detailLoading} 
        cancelSubmission={cancelSubmission}
        resubmitSubmission={resubmitSubmission} // 'resubmitSubmission' is not defined
        fetchDetail={fetchDetail} // <--- TAMBAHKAN BARIS INI
      />
    </div>
  );
}