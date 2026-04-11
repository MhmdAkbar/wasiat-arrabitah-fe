import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import DynamicFormRenderer from "../../molecules/submission/DynamicFormRenderer";

export default function DocumentDetailModal(props) {
  const {
    isOpen,
    onClose,
    detailData,
    loading,
    cancelSubmission,
    resubmitSubmission,
    processApproval,
    fetchDetail,
  } = props;
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [comments, setComments] = useState("");

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");

  // --- STATE BARU: UNTUK TTD APPROVER ---
  const [signatureFile, setSignatureFile] = useState(null);

  useEffect(() => {
    if (isOpen && detailData) {
      setIsEditing(false);
      setComments("");
      setSignatureFile(null); // Reset file TTD
      setUploadFile(null);
      setUploadTitle("");
      setEditFormData(detailData.formData || {});
    }
  }, [isOpen, detailData]);

  // (Sembunyikan handleDynamicFieldChange, executeUpload, dll yang sudah ada sebelumnya)
  const handleDynamicFieldChange = (key, value, type) =>
    setEditFormData((prev) => ({
      ...prev,
      [key]: type === "number" ? Number(value) : value,
    }));
  const handleSaveRevision = () =>
    resubmitSubmission(detailData.id, editFormData);

  // --- FITUR BARU: FUNGSI UNDUH PDF ---
  const handleDownloadPdf = async () => {
    const tid = toast.loading("Menyiapkan dokumen PDF...");
    try {
      const blob = await api(`/api/exports/pdf/${detailData.id}`, {
        method: "GET",
      });

      // Buat URL sementara dari Blob, lalu trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Format nama file: DOC_FRM-CUTI_2026_001.pdf
      a.download = `${detailData.docNumber.replace(/\//g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF berhasil diunduh!", { id: tid });
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  };

  // --- FUNGSI BARU: UI KONFIRMASI APPROVAL ---
  const confirmApprovalAction = (
    approvalId,
    action,
    comments,
    signatureFile,
  ) => {
    // Validasi awal di UI agar tidak perlu muncul popup konfirmasi jika komentar kosong
    if (
      (action === "reject" || action === "return") &&
      (!comments || !comments.trim())
    ) {
      toast.error(
        "Catatan/Komentar wajib diisi jika menolak atau mengembalikan dokumen!",
      );
      return;
    }

    const actionText =
      action === "approve"
        ? "menyetujui"
        : action === "reject"
          ? "menolak"
          : "mengembalikan";

    toast(
      (t) => (
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">
            Apakah Anda yakin ingin <b>{actionText}</b> dokumen ini?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                // Panggil logika murni dari props/hook di sini
                if (processApproval) {
                  await processApproval(
                    approvalId,
                    action,
                    comments,
                    signatureFile,
                  );
                }
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-mosque-primary rounded hover:bg-mosque-dark shadow-sm"
            >
              Ya, Proses
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  if (!isOpen) return null;

  const activeApproval = detailData?.approvals?.find(
    (a) => a.status === "submitted",
  );
  const returnedApproval = detailData?.approvals?.find(
    (a) => a.status === "returned",
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-mosque-primary">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-mosque-dark">
              {isEditing ? "Revisi Dokumen" : t("submission.detail_title")}
            </h3>
            {!loading && detailData && (
              <p className="text-xs text-gray-500 font-mono mt-1">
                {detailData.docNumber}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* TOMBOL UNDUH PDF (Hanya muncul jika Selesai/Approved) */}
            {!loading && detailData && detailData.status === "approved" && (
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-sm animate-fade-in"
              >
                <i className="fa-solid fa-file-pdf"></i> Unduh PDF
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
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
              {/* ... [BIARKAN HEADER INFO, FORM DINAMIS, DAN LAMPIRAN SAMA SEPERTI SEBELUMNYA] ... */}
              {/* ... SAYA LOMPAT KE BAGIAN APPROVAL ACTION DI BAWAH ... */}

              {/* Area Teks Biasa Form (Contoh) */}
              {!isEditing && (
                <div>
                  <h5 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">
                    <i className="fa-solid fa-file-lines text-mosque-primary mr-2"></i>{" "}
                    {t("submission.form_data")}
                  </h5>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailData.formTemplate.schemaDefinition.fields.map(
                      (field) => (
                        <div key={field.key} className="col-span-1">
                          <p className="text-xs text-gray-500 font-semibold uppercase">
                            {field.label}
                          </p>
                          <p className="text-sm text-gray-800 font-medium mt-1">
                            {field.type === "number"
                              ? new Intl.NumberFormat("en-SG", {
                                  style: "currency",
                                  currency: "SGD",
                                }).format(detailData.formData[field.key])
                              : detailData.formData[field.key] || "-"}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* --- KOTAK KEPUTUSAN APPROVER (DENGAN INPUT TTD) --- */}
              {processApproval && activeApproval && (
                <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                  <h5 className="text-sm font-bold text-blue-900 mb-3">
                    <i className="fa-solid fa-clipboard-check mr-2"></i>
                    {t("submission.approval_action")}
                  </h5>

                  {/* Input Komentar */}
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={t("submission.comments_placeholder")}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-4"
                    rows="2"
                  />

                  {/* Input Upload Tanda Tangan */}
                  <div className="mb-4 bg-white p-3 border border-blue-100 rounded-lg">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      <i className="fa-solid fa-signature text-mosque-primary mr-1"></i>
                      Upload Tanda Tangan{" "}
                      <span className="text-gray-400 font-normal">
                        (Opsional jika sudah ada di profil)
                      </span>
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setSignatureFile(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons */}
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={() =>
                        confirmApprovalAction(
                          activeApproval.id,
                          "reject",
                          comments,
                          signatureFile,
                        )
                      }
                      className="px-5 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-bold transition"
                    >
                      <i className="fa-solid fa-xmark mr-1.5"></i>{" "}
                      {t("submission.reject")}
                    </button>
                    <button
                      onClick={() =>
                        confirmApprovalAction(
                          activeApproval.id,
                          "return",
                          comments,
                          signatureFile,
                        )
                      }
                      className="px-5 py-2.5 bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg text-sm font-bold transition"
                    >
                      <i className="fa-solid fa-rotate-left mr-1.5"></i>{" "}
                      {t("submission.return")}
                    </button>
                    <button
                      onClick={() =>
                        confirmApprovalAction(
                          activeApproval.id,
                          "approve",
                          comments,
                          signatureFile,
                        )
                      }
                      className="px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition shadow-md"
                    >
                      <i className="fa-solid fa-check mr-1.5"></i>{" "}
                      {t("submission.approve")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ... [BAGIAN FOOTER BUTTON TETAP SAMA] ... */}
      </div>
    </div>
  );
}
