export default function DynamicFormRenderer({ fields, formData, onChange }) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">
        <i className="fa-solid fa-file-pen"></i> Form Details
      </h4>
      
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              required={field.required}
              value={formData[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value, field.type)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mosque-primary outline-none text-sm"
            />
          ) : field.type === 'currency' ? (
            // Format Khusus Currency
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm font-medium">SGD</span>
              </div>
              <input
                type="number"
                required={field.required}
                value={formData[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value, field.type)}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mosque-primary outline-none text-sm"
                placeholder="0.00"
              />
            </div>
          ) : (
            // Input Number biasa, Date, atau Text
            <input
              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
              required={field.required}
              value={formData[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value, field.type)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mosque-primary outline-none text-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
}