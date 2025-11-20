import { useState } from "react";
import { useRequestStore } from "../store/useRequestStore";
import { formatJson } from "../utils/http";

type ResponseTab = "body" | "headers";

export function ResponsePanel() {
  const { currentResponse, isLoading } = useRequestStore();
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (currentResponse) {
      if (activeTab === "body") {
        navigator.clipboard.writeText(formatJson(currentResponse.data));
      } else {
        const headersText = Object.entries(currentResponse.headers)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        navigator.clipboard.writeText(headersText);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="w-[45%] min-w-[400px] flex flex-col bg-surface dark:bg-gray-800">
      {/* Response header */}
      <div className="p-4 border-b border-outline/20 dark:border-gray-700 bg-surface dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Response
          </h2>

          {currentResponse && (
            <div className="flex items-center gap-3 text-sm">
              <span
                className={`px-3 py-1 rounded-full font-medium text-xs ${
                  currentResponse.status >= 200 && currentResponse.status < 300
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : currentResponse.status >= 400
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                }`}
              >
                {currentResponse.status} {currentResponse.statusText}
              </span>
              <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
                {currentResponse.responseTime}ms
              </span>
              <button
                onClick={handleCopy}
                className={`px-3 py-1 text-xs rounded-full transition-all font-medium flex items-center gap-1 ${
                  isCopied
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                    : "bg-surface-variant dark:bg-gray-700 hover:bg-surface-variant/80 dark:hover:bg-gray-600 text-primary dark:text-primary-container"
                }`}
              >
                {isCopied ? (
                  <>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Response tabs */}
      {currentResponse && (
        <div className="border-b border-outline/20 dark:border-gray-700 bg-surface dark:bg-gray-800">
          <div className="flex px-4">
            <button
              onClick={() => setActiveTab("body")}
              className={`relative px-6 py-3 text-sm font-medium transition-colors capitalize ${
                activeTab === "body"
                  ? "text-primary dark:text-primary-container"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-surface-variant/30"
              }`}
            >
              Body
              {activeTab === "body" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-container rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("headers")}
              className={`relative px-6 py-3 text-sm font-medium transition-colors capitalize ${
                activeTab === "headers"
                  ? "text-primary dark:text-primary-container"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-surface-variant/30"
              }`}
            >
              Headers
              {activeTab === "headers" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-container rounded-t-full" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Response content */}
      <div className="flex-1 p-4 overflow-auto bg-surface dark:bg-gray-900">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="text-gray-500 dark:text-gray-400">
                Sending request...
              </div>
            </div>
          </div>
        ) : currentResponse ? (
          <div className="bg-surface-variant/30 dark:bg-gray-800/50 rounded-xl p-4 h-full overflow-auto border border-outline/10">
            {activeTab === "body" && (
              <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono leading-relaxed whitespace-pre-wrap break-words">
                {formatJson(currentResponse.data)}
              </pre>
            )}
            {activeTab === "headers" && (
              <div className="space-y-2">
                {Object.entries(currentResponse.headers).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start py-2 border-b border-outline/10 dark:border-gray-700 last:border-0"
                  >
                    <div className="font-semibold text-gray-700 dark:text-gray-300 w-48 flex-shrink-0 text-xs uppercase tracking-wider">
                      {key}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 flex-1 break-all font-mono text-sm">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <svg
                className="mx-auto h-16 w-16 mb-4 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="text-lg mb-2 font-medium">No Response</p>
              <p className="text-sm">Send a request to see the response here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
