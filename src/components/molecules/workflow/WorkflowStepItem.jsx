// src/components/molecules/workflow/WorkflowStepItem.jsx
import React from "react";
export default function WorkflowStepItem({
  index,
  item,
  onChange,
  onRemove,
  isLast = false, // New prop for connector UI
  isOnly = false, // New prop to prevent deletion if only 1 left
}) {
  return (
    // 1. Container changed to Card-like with hover effect
    <div className="group relative flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 mb-3">
      {/* 2. Drag Handle (Gives the impression that the order can be changed/dragged) */}
      <div
        className="cursor-grab text-gray-300 hover:text-gray-500 transition-colors pl-1"
        title="Hold to drag and reorder"
      >
        <i className="fa-solid fa-grip-vertical"></i>
      </div>

      {/* 3. Number Circle with Connector Line */}
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-mosque-light text-mosque-primary font-bold flex items-center justify-center border-2 border-white shadow-sm text-sm z-10">
          {index + 1}
        </div>
        {/* Visual connector line to the next item (Except the last item) */}
        {!isLast && (
          <div className="absolute top-8 w-[2px] h-full bg-gray-100 -z-0"></div>
        )}
      </div>

      {/* 4. Main Content Area */}
      <div className="flex-1 flex items-center gap-3">
        {/* Beautified Role Dropdown */}
        <div className="flex-1 relative">
          {/* Label for Screen Reader (A11y) */}
          <label htmlFor={`role-select-${item.id}`} className="sr-only">
            Select Role for Step {index + 1}
          </label>

          <select
            id={`role-select-${item.id}`}
            value={item.role || ""}
            onChange={(e) => onChange(item.id, e.target.value)}
            // appearance-none hides the browser's default arrow so we can use a custom icon
            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-mosque-primary focus:border-mosque-primary outline-none text-sm cursor-pointer font-medium text-gray-700 transition-colors appearance-none"
          >
            <option value="" disabled>
              Select Role...
            </option>
            <option value="verifier">Verifier</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
            <option value="admin">Admin</option>
          </select>

          {/* Custom Chevron Icon for Dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <i className="fa-solid fa-chevron-down text-xs"></i>
          </div>
        </div>

        {/* 5. Delete Button with Disabled State & Accessibility Focus */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isOnly}
          className={`p-2.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-200 flex-shrink-0
            ${
              isOnly
                ? "text-gray-300 cursor-not-allowed bg-transparent"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50 group-hover:text-red-400"
            }`}
          aria-label={`Delete step ${index + 1}`}
          title={isOnly ? "Must have at least 1 step" : "Delete this step"}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  );
}
