// src/pages/template/TemplateManagement.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

// Hooks & Context
import { useTemplates } from "../../hooks/template/useTemplates";
import { useWorkflow } from "../../hooks/workflow/useWorkflow";
import { useAuth } from "../../contexts/AuthContext";

// Modals
import CreateTemplateModal from "../../components/organisms/template/CreateTemplateModal";
import WorkflowModal from "../../components/organisms/workflow/WorkflowModal";

export default function TemplateManagement() {
  const { t } = useTranslation();
  const { user } = useAuth(); // Consume global state safely

  // Custom Hooks
  const {
    templates,
    loading: loadingTemplates,
    error,
    createTemplate,
    executeDeleteTemplate 
  } = useTemplates();
  
  const {
    loading: loadingWorkflow,
    getWorkflow,
    setupWorkflow,
  } = useWorkflow();

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateForWorkflow, setSelectedTemplateForWorkflow] = useState(null);

  // Secure role evaluation
  const isAdmin = user?.role === "admin";

  const confirmDelete = (id, templateName) => {
    toast(
      (t) => (
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">
            Are you sure you want to delete the template <b>{templateName}</b>?
          </p>
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => toast.dismiss(t.id)} 
              className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                await executeDeleteTemplate(id);
              }} 
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded hover:bg-red-700 transition"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("template.title")}
          </h2>
          <p className="text-sm text-gray-500">{t("template.desc")}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-mosque-dark hover:bg-mosque-primary text-white px-5 py-2.5 rounded-lg shadow-md transition flex items-center gap-2 font-medium"
          >
            <i className="fa-solid fa-plus"></i> {t("template.add_btn")}
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("template.code")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("template.name")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("template.status")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingTemplates ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{" "}
                    Loading...
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {t("template.empty")}
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-mosque-primary font-medium">
                      {tpl.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                      {tpl.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${tpl.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {tpl.isActive ? t("template.active") : "Inactive"}
                      </span>
                    </td>
                    
                    {/* Action Column */}
                    <td className="px-6 py-4 text-sm text-right flex items-center justify-end gap-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => setSelectedTemplateForWorkflow(tpl)}
                            className="px-3 py-1.5 bg-mosque-light text-mosque-primary hover:bg-mosque-primary hover:text-white rounded text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-sitemap"></i>{" "}
                            {t("template.workflow_btn")}
                          </button>
                          
                          <button 
                            onClick={() => confirmDelete(tpl.id, tpl.name)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded text-xs font-bold transition flex items-center gap-1.5 border border-red-100 hover:border-red-600"
                            title="Delete Template"
                          >
                            <i className="fa-solid fa-trash-can"></i> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        createTemplate={createTemplate}
      />

      <WorkflowModal
        isOpen={!!selectedTemplateForWorkflow}
        onClose={() => setSelectedTemplateForWorkflow(null)}
        template={selectedTemplateForWorkflow}
        getWorkflow={getWorkflow}
        setupWorkflow={setupWorkflow}
        loadingWorkflow={loadingWorkflow}
      />
    </div>
  );
}