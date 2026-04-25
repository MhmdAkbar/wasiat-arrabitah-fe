// src/pages/submission/DocumentSubmission.jsx
import { useTranslation } from "react-i18next";
import { useDocumentSubmission } from "../../hooks/submission/useDocumentSubmission";
import DynamicFormRenderer from "../../components/molecules/submission/DynamicFormRenderer";

export default function DocumentSubmission() {
  const { t } = useTranslation();
  const {
    templates,
    selectedTemplate,
    title,
    setTitle,
    formData,
    loading,
    submitLoading,
    error,
    handleTemplateChange,
    handleDynamicFieldChange,
    handleSubmit,
  } = useDocumentSubmission();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-soft border-t-4 border-mosque-gold">
        <h2 className="text-2xl font-bold text-mosque-dark mb-1">
          {t("submission.title")}
        </h2>
        <p className="text-sm text-gray-500 mb-6">{t("submission.desc")}</p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("submission.select_template")}
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mosque-primary outline-none cursor-pointer"
              onChange={handleTemplateChange}
              value={selectedTemplate?.id || ""}
              disabled={loading}
            >
              <option value="" disabled>
                -- {t("submission.select_template")} --
              </option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.code} - {tpl.name}
                </option>
              ))}
            </select>
            {loading && (
              <p className="text-xs text-gray-500 mt-1">
                <i className="fa-solid fa-spinner fa-spin"></i> Loading
                template...
              </p>
            )}
          </div>

          {/* Show detail form only if a template is selected */}
          {selectedTemplate && (
            <div className="animate-fade-in space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("submission.doc_title")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Example: April Server Cost Request"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mosque-primary outline-none"
                />
              </div>

              {/* RENDER DYNAMIC FORM BASED ON JSON SCHEMA */}
              <DynamicFormRenderer
                fields={selectedTemplate.schemaDefinition.fields}
                formData={formData}
                onChange={handleDynamicFieldChange}
              />

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-8 py-3 font-bold text-white bg-mosque-dark hover:bg-mosque-primary rounded-xl transition flex items-center gap-2 shadow-md disabled:opacity-70"
                >
                  {submitLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                      {t("submission.loading")}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>{" "}
                      {t("submission.submit_btn")}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}