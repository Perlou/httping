import { useRequestStore } from "../store/useRequestStore";
import { sendHttpRequest, replaceEnvVariables } from "../utils/http";

export function RequestPanel() {
  const {
    currentRequest,
    setCurrentRequest,
    setCurrentResponse,
    isLoading,
    setIsLoading,
    addToHistory,
    currentEnvironment,
  } = useRequestStore();

  const handleSend = async () => {
    if (!currentRequest.url.trim()) {
      alert("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setCurrentResponse(null);

    try {
      // Replace environment variables in URL
      const processedRequest = {
        ...currentRequest,
        url: currentEnvironment
          ? replaceEnvVariables(
              currentRequest.url,
              currentEnvironment.variables
            )
          : currentRequest.url,
      };

      // Send request
      const response = await sendHttpRequest(processedRequest);

      // Update response
      setCurrentResponse(response);

      // Add to history
      addToHistory({
        request: processedRequest,
        response,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Request failed:", error);
      alert(
        "Request failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Request URL bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          {/* Method selector */}
          <select
            value={currentRequest.method}
            onChange={(e) =>
              setCurrentRequest({ method: e.target.value as any })
            }
            disabled={isLoading}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium disabled:opacity-50"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>

          {/* URL input */}
          <input
            type="text"
            placeholder="Enter request URL (e.g., https://api.example.com/users)"
            value={currentRequest.url}
            onChange={(e) => setCurrentRequest({ url: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSend();
              }
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 px-4">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400">
            Headers
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Body
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Auth
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Headers panel (to be implemented)
        </div>
      </div>
    </div>
  );
}
