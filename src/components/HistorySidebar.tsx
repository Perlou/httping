import { useRequestStore } from "../store/useRequestStore";

export function HistorySidebar() {
  const { history } = useRequestStore();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          History
        </h2>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No history yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {item.request.method}
                  </span>
                  {item.response && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        item.response.status >= 200 &&
                        item.response.status < 300
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.response.status}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {item.request.url || "No URL"}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
