// src/components/organisms/template/FieldBuilder.jsx
import { useTranslation } from "react-i18next";
import FieldItem from "../../molecules/template/FieldItem";

export default function FieldBuilder({ fields, onAdd, onRemove, onChange }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
          <i className="fa-solid fa-list-check text-mosque-primary"></i>
          {t("template.builder_title")}
        </h4>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <FieldItem
            key={field.id}
            field={field}
            onChange={onChange}
            onRemove={onRemove}
            canRemove={fields.length > 1}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 text-sm font-semibold text-mosque-primary hover:text-mosque-dark flex items-center gap-2 px-2 py-1 rounded hover:bg-mosque-light transition"
      >
        <i className="fa-solid fa-circle-plus"></i> {t("template.add_field")}
      </button>
    </div>
  );
}