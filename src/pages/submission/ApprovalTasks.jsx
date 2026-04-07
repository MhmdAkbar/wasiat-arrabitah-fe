import { useTranslation } from 'react-i18next';
import { useApprovalTasks } from '../../hooks/submission/useApprovalTasks';
import DocumentDetailModal from '../../components/organisms/submission/DocumentDetailModal';

export default function ApprovalTasks() {
  const { t } = useTranslation();
  const { 
    tasks, loading, error, 
    detailData, detailLoading, fetchDetail, clearDetail,
    processApproval
  } = useApprovalTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('submission.task_list')}</h2>
          <p className="text-sm text-gray-500">{t('submission.task_list_desc')}</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>}

      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.doc_no')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.submitter')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.form_type')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('submission.date')}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t('submission.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Memuat tugas...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Tidak ada dokumen yang menunggu persetujuan Anda.</td></tr>
              ) : (
                tasks.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition border-l-4 border-l-orange-400">
                    <td className="px-6 py-4 text-sm font-mono text-mosque-primary font-medium">{doc.docNumber}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800 font-semibold">{doc.submitter.name}</p>
                      <p className="text-xs text-gray-500">{doc.submitter.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{doc.formTemplate.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button 
                        onClick={() => fetchDetail(doc.id)}
                        className="px-3 py-1.5 bg-mosque-primary text-white hover:bg-mosque-dark rounded text-xs font-bold transition flex items-center gap-1.5 ml-auto shadow-sm"
                      >
                        <i className="fa-solid fa-stamp"></i> Proses
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentDetailModal 
        isOpen={!!detailData || detailLoading} 
        onClose={clearDetail} 
        detailData={detailData} 
        loading={detailLoading} 
        processApproval={processApproval} // <--- Kirim fungsi ini agar kotak keputusan muncul di Modal
      />
    </div>
  );
}