// src/components/molecules/submission/DocumentFormData.jsx
import { useTranslation } from "react-i18next";
import DynamicFormRenderer from "./DynamicFormRenderer";

export default function DocumentFormData({
  detailData,
  isEditing,
  setIsEditing,
  editFormData,
  handleDynamicFieldChange,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h5 className="text-sm font-bold text-gray-700">
          <i className="fa-solid fa-file-lines text-mosque-primary mr-2"></i>{" "}
          {t("submission.form_data")}
        </h5>
        {detailData.status === "returned" && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-bold text-mosque-primary hover:underline"
          >
            <i className="fa-solid fa-pen-to-square mr-1"></i> Edit Revision
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <DynamicFormRenderer
            fields={detailData.formTemplate.schemaDefinition.fields}
            formData={editFormData}
            onChange={handleDynamicFieldChange}
          />
        </div>
      ) : (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailData.formTemplate.schemaDefinition.fields.map((field) => (
            <div key={field.key} className="col-span-1">
              <p className="text-xs text-gray-500 font-semibold uppercase">
                {field.label}
              </p>
              <p className="text-sm text-gray-800 font-medium mt-1">
                {field.type === "number"
                  ? field.format === "currency"
                    ? new Intl.NumberFormat("en-SG", {
                        style: "currency",
                        currency: "SGD",
                      }).format(detailData.formData[field.key] || 0)
                    : new Intl.NumberFormat("en-SG").format(
                        detailData.formData[field.key] || 0,
                      )
                  : field.type === "date" && detailData.formData[field.key]
                    ? // Logic untuk format tanggal bahasa Inggris
                      new Intl.DateTimeFormat("en-GB", {
                        weekday: "long", // Saturday
                        day: "numeric", // 11
                        month: "long", // April
                        year: "numeric", // 2026
                      }).format(new Date(detailData.formData[field.key]))
                    : detailData.formData[field.key] || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
