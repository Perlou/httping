import { useRequestStore } from "../store/useRequestStore";

export function ResponsePanel() {
  const { currentResponse, isLoading } = useRequestStore();

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Response header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Response
          </h2>

          {currentResponse && (
            <div className="flex items-center space-x-4 text-sm">
              <span
                className={`px-2 py-1 rounded font-medium ${
                  currentResponse.status >= 200 && currentResponse.status < 300
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {currentResponse.status} {currentResponse.statusText}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {currentResponse.responseTime}ms
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Response tabs */}
      {currentResponse && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 px-4">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400">
              Body
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Headers
            </button>
          </div>
        </div>
      )}

      {/* Response content */}
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : currentResponse ? (
          <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono">
            {JSON.stringify(currentResponse.data, null, 2)}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">No response yet</p>
              <p className="text-sm">Send a request to see the response here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
