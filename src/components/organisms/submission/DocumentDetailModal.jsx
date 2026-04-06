import { useTranslation } from 'react-i18next';

export default function DocumentDetailModal({ isOpen, onClose, detailData, loading }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-mosque-primary">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-mosque-dark">{t('submission.detail_title')}</h3>
            {!loading && detailData && <p className="text-xs text-gray-500 font-mono mt-1">{detailData.docNumber}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {loading || !detailData ? (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-mosque-primary mb-3"></i>
              <p className="text-gray-500 text-sm">Memuat detail dokumen...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{detailData.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">{t('submission.submitter')}:</span> {detailData.submitter.name} ({detailData.submitter.department || '-'})
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">{t('submission.form_type')}:</span> {detailData.formTemplate.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                    {detailData.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">{new Date(detailData.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Form Data Dinamis */}
              <div>
                <h5 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2"><i className="fa-solid fa-file-lines text-mosque-primary mr-2"></i> {t('submission.form_data')}</h5>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Melakukan mapping dari schemaDefinition fields terhadap nilai formData */}
                  {detailData.formTemplate.schemaDefinition.fields.map(field => (
                    <div key={field.key} className="col-span-1">
                      <p className="text-xs text-gray-500 font-semibold uppercase">{field.label}</p>
                      <p className="text-sm text-gray-800 font-medium mt-1">
                        {/* Jika tipe number, format ke angka/rupiah. Jika tidak, tampilkan string. */}
                        {field.type === 'number' 
                          ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detailData.formData[field.key])
                          : detailData.formData[field.key] || '-'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Logs / Timeline */}
              <div>
                <h5 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2"><i className="fa-solid fa-clock-rotate-left text-mosque-primary mr-2"></i> {t('submission.audit_trail')}</h5>
                <div className="space-y-4 ml-2 border-l-2 border-gray-200 pl-4 relative">
                  {detailData.auditLogs.map(log => (
                    <div key={log.id} className="relative">
                      {/* Dot Timeline */}
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-mosque-primary border-2 border-white shadow"></div>
                      <p className="text-xs font-bold text-gray-800">{log.action} <span className="font-normal text-gray-500 ml-2">{new Date(log.createdAt).toLocaleString()}</span></p>
                      <p className="text-sm text-gray-600 mt-0.5">{log.notes}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Oleh: {log.user.name}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}