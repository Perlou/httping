import { useRequestStore } from "../store/useRequestStore";
import { sendHttpRequest, replaceEnvVariables } from "../utils/http";
import { RequestTabs } from "./RequestTabs";

export function RequestPanel() {
  const {
    currentRequest,
    setCurrentRequest,
    setCurrentResponse,
    isLoading,
    setIsLoading,
    addToHistory,
    currentEnvironment,
    authConfig,
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
      let urlWithEnv = currentEnvironment
        ? replaceEnvVariables(currentRequest.url, currentEnvironment.variables)
        : currentRequest.url;

      // Auto-prepend http:// if protocol is missing
      if (!/^https?:\/\//i.test(urlWithEnv)) {
        urlWithEnv = `http://${urlWithEnv}`;
      }

      const processedRequest = {
        ...currentRequest,
        url: urlWithEnv,
      };

      // Validate URL
      try {
        const url = new URL(processedRequest.url);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error("Only HTTP and HTTPS protocols are supported");
        }
      } catch (e) {
        alert("Please enter a valid URL (e.g., https://api.example.com)");
        return;
      }

      // Send request
      const response = await sendHttpRequest(processedRequest, authConfig);

      // Update response
      setCurrentResponse(response);

      // Add to history
      try {
        addToHistory({
          request: processedRequest,
          response,
          timestamp: Date.now(),
        });
      } catch (historyError) {
        alert(
          historyError instanceof Error
            ? historyError.message
            : "Failed to save history"
        );
      }
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
    <div className="flex-1 flex flex-col bg-surface dark:bg-gray-800 border-r border-outline/20 dark:border-gray-700">
      {/* Request URL bar */}
      <div className="p-4 border-b border-outline/20 dark:border-gray-700 bg-surface dark:bg-gray-800">
        <div className="flex items-center gap-3">
          {/* Method selector */}
          <div className="relative">
            <select
              value={currentRequest.method}
              onChange={(e) =>
                setCurrentRequest({ method: e.target.value as any })
              }
              disabled={isLoading}
              className="appearance-none pl-4 pr-10 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer transition-all hover:border-gray-400 dark:hover:border-gray-500"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* URL input */}
          <div className="flex-1 relative group">
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
              className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:shadow-none flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Request configuration tabs */}
      <RequestTabs />
    </div>
  );
}
