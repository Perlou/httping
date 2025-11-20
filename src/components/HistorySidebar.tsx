import { useRequestStore } from "../store/useRequestStore";

export function HistorySidebar() {
  const { history, clearHistory, setCurrentRequest, removeFromHistory } =
    useRequestStore();

  const handleRestore = (request: any) => {
    // Create a new object excluding the id and timestamp to avoid overwriting current request's metadata if not desired,
    // or just overwrite everything.
    // Based on useRequestStore, setCurrentRequest does a shallow merge.
    // We probably want to keep the current ID or generate a new one if we are "restoring" as a new draft,
    // but for now let's just restore the content.
    const { id, timestamp, ...requestData } = request;
    setCurrentRequest(requestData);
  };

  return (
    <div className="w-64 bg-surface dark:bg-gray-800 border-r border-outline/20 dark:border-gray-700 flex flex-col py-2">
      {/* Sidebar header */}
      <div className="px-4 py-3 flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          History
        </h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs text-primary hover:text-on-primary-container hover:bg-primary-container font-medium px-3 py-1 rounded-full transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* History list */}
      <div className="flex-1 overflow-auto px-3 space-y-1">
        {history.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No history yet
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => handleRestore(item.request)}
                className="px-4 py-3 rounded-lg hover:bg-surface-variant dark:hover:bg-gray-700 cursor-pointer transition-colors group flex flex-col gap-1 relative pr-10"
                title="Click to restore"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary dark:text-primary-container">
                    {item.request.method}
                  </span>
                  {item.response && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
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
                <div className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
                  {item.request.url || "No URL"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(item.request.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
