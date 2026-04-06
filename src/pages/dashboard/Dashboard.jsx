import { useTranslation } from "react-i18next";
import { useDashboard } from "../../hooks/dashboard/useDashboard"; // Import Custom Hook

export default function Dashboard() {
  const { t } = useTranslation();

  // Ambil state dan fungsi dari hook
  const { apiResponse, loading, handleTestAccess } = useDashboard();

  return (
    <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-100">
      <h4 className="text-lg font-bold text-gray-800 mb-1">
        {t("dashboard.test_api_title")}
      </h4>
      <p className="text-sm text-gray-500 mb-6">
        {t("dashboard.test_api_desc")}
      </p>

      <button
        onClick={handleTestAccess}
        disabled={loading}
        className="bg-mosque-dark hover:bg-mosque-primary text-white py-2.5 px-6 rounded-lg shadow-md transition disabled:opacity-70 flex gap-2 items-center"
      >
        <i
          className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-network-wired"}`}
        ></i>
        {t("dashboard.test_api_btn")}
      </button>

      {apiResponse && (
        <div className="mt-8">
          <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <pre className="bg-gray-900 text-green-400 p-5 rounded-b-lg overflow-x-auto text-sm font-mono shadow-inner">
            {apiResponse}
          </pre>
        </div>
      )}
    </div>
  );
}
