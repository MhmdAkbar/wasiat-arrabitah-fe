//src/components/molecules/submission/DocumentModalFooter.jsx

export default function DocumentModalFooter({ isEditing, setIsEditing, handleSaveRevision, loading, detailData, cancelSubmission, onClose }) {
  return (
    <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-white flex-shrink-0">
      <div>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleSaveRevision} className="px-4 py-2 text-sm font-bold text-white bg-mosque-primary hover:bg-mosque-dark rounded-lg">Save & Resubmit</button>
          </div>
        ) : (
          !loading && detailData?.status === "submitted" && cancelSubmission && (
            <button onClick={() => cancelSubmission(detailData.id)} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
              <i className="fa-solid fa-ban"></i> Cancel Submission
            </button>
          )
        )}
      </div>
      {!isEditing && <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Close</button>}
    </div>
  );
}