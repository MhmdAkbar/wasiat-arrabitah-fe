import { useDocumentDetailModal } from "../../../hooks/submission/useDocumentDetailModal";
import DocumentModalHeader from "../../molecules/submission/DocumentModalHeader";
import DocumentModalFooter from "../../molecules/submission/DocumentModalFooter";
import DocumentSummaryCard from "../../molecules/submission/DocumentSummaryCard";
import DocumentFormData from "../../molecules/submission/DocumentFormData";
import DocumentAttachments from "../../molecules/submission/DocumentAttachments";
import DocumentApprovalBox from "../../molecules/submission/DocumentApprovalBox";
import DocumentAuditTrail from "../../molecules/submission/DocumentAuditTrail";

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

  // Panggil hook untuk semua logika
  const state = useDocumentDetailModal({
    isOpen,
    detailData,
    fetchDetail,
    resubmitSubmission,
    processApproval,
  });

  if (!isOpen) return null;

  const activeApproval = detailData?.approvals?.find(
    (a) => a.status === "submitted",
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-mosque-primary">
        <DocumentModalHeader
          isEditing={state.isEditing}
          detailData={detailData}
          loading={loading}
          handleDownloadPdf={state.handleDownloadPdf}
          onClose={onClose}
        />

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {loading || !detailData ? (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-mosque-primary mb-3"></i>
              <p className="text-gray-500 text-sm">
                Loading document details...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <DocumentSummaryCard detailData={detailData} />
              <DocumentFormData
                detailData={detailData}
                isEditing={state.isEditing}
                setIsEditing={state.setIsEditing}
                editFormData={state.editFormData}
                handleDynamicFieldChange={state.handleDynamicFieldChange}
              />
              <DocumentAttachments
                detailData={detailData}
                uploadFile={state.uploadFile}
                setUploadFile={state.setUploadFile}
                uploadTitle={state.uploadTitle}
                setUploadTitle={state.setUploadTitle}
                handleFileSelect={state.handleFileSelect}
                executeUpload={state.executeUpload}
                executeDeleteAttachment={
                  state.executeDeleteAttachment
                } /* Menggunakan execute */
                isEditing={state.isEditing}
                processApproval={processApproval}
              />
              {processApproval && activeApproval && (
                <DocumentApprovalBox
                  comments={state.comments}
                  setComments={state.setComments}
                  processApproval={
                    processApproval
                  } /* <--- PENTING: Gunakan processApproval secara langsung */
                  activeApproval={activeApproval}
                />
              )}
              <DocumentAuditTrail auditLogs={detailData.auditLogs} />
            </div>
          )}
        </div>

        <DocumentModalFooter
          isEditing={state.isEditing}
          setIsEditing={state.setIsEditing}
          handleSaveRevision={state.handleSaveRevision}
          loading={loading}
          detailData={detailData}
          cancelSubmission={cancelSubmission}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
