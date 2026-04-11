// src/components/molecules/submission/DocumentAttachments.jsx
import { toast } from "react-hot-toast";

export default function DocumentAttachments({ 
  detailData, 
  uploadFile, 
  setUploadFile, 
  uploadTitle, 
  setUploadTitle, 
  handleFileSelect, 
  executeUpload, 
  executeDeleteAttachment, 
  isEditing, 
  processApproval 
}) {
  
  // UI Confirmation JSX relocated here since toast requires React elements
  const confirmDelete = (attachmentId) => {
    toast((t) => (
      <div>
        <p className="text-sm font-bold text-gray-800 mb-3">Delete this attachment?</p>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition rounded"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const tid = toast.loading("Deleting...");
              await executeDeleteAttachment(attachmentId, tid);
            }} 
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div>
      <h5 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2 flex justify-between items-center">
        <span><i className="fa-solid fa-paperclip text-mosque-primary mr-2"></i> File Attachments</span>
        
        {/* Select File Button */}
        {!uploadFile && detailData.status !== "approved" && detailData.status !== "rejected" && !isEditing && !processApproval && (
          <label className="cursor-pointer bg-mosque-light hover:bg-mosque-primary hover:text-white text-mosque-dark px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5">
            <i className="fa-solid fa-plus"></i> Add File
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
          </label>
        )}
      </h5>

      {/* Inline Upload Form */}
      {uploadFile && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4 animate-fade-in shadow-sm">
          <div className="flex justify-between items-center mb-3 border-b border-blue-200/50 pb-2">
            <span className="text-xs font-semibold text-blue-800 flex items-center gap-2">
              <i className={`fa-solid ${uploadFile.name.endsWith(".pdf") ? "fa-file-pdf text-red-500" : "fa-image text-blue-500"} text-lg`}></i>
              {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
            <button onClick={() => setUploadFile(null)} className="text-gray-400 hover:text-red-500 text-xs font-bold transition">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter title (e.g., Purchase Receipt)" 
              value={uploadTitle} 
              onChange={(e) => setUploadTitle(e.target.value)} 
              className="flex-1 text-sm p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              autoFocus 
            />
            <button onClick={executeUpload} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md transition whitespace-nowrap">
              <i className="fa-solid fa-cloud-arrow-up mr-1.5"></i> Upload
            </button>
          </div>
        </div>
      )}

      {/* Attachments List */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
        {detailData.attachments && detailData.attachments.length > 0 ? (
          detailData.attachments.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition group">
              
              {/* Left Area: Icon & Detail Info (Click to open file) */}
              <a 
                href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}${file.fileUrl}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 flex items-center gap-3 truncate"
              >
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
                  <i className={`text-xl fa-solid ${file.fileName.endsWith(".pdf") ? "fa-file-pdf text-red-500" : "fa-image text-blue-500"}`}></i>
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-mosque-primary transition truncate">{file.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{file.fileName} • {new Date(file.uploadedAt).toLocaleString()}</p>
                </div>
              </a>

              {/* Right Area: Delete Button (Triggers Confirmation) */}
              {!processApproval && !isEditing && (detailData.status === "submitted" || detailData.status === "returned") && (
                <button 
                  onClick={() => confirmDelete(file.id)} 
                  className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition shrink-0"
                  title="Delete Attachment"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic text-center py-4 flex flex-col items-center gap-2">
            <i className="fa-solid fa-folder-open text-2xl text-gray-300"></i> No files attached yet.
          </p>
        )}
      </div>
    </div>
  );
}