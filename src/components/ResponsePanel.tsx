import { useState } from "react";
import { useRequestStore } from "../store/useRequestStore";
import { formatJson } from "../utils/http";

type ResponseTab = "body" | "headers";

export function ResponsePanel() {
  const { currentResponse, isLoading } = useRequestStore();
  const [activeTab, setActiveTab] = useState<ResponseTab>("body");

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
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      {/* Response header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            响应
          </h2>

          {currentResponse && (
            <div className="flex items-center space-x-4 text-sm">
              <span
                className={`px-2 py-1 rounded font-medium ${
                  currentResponse.status >= 200 && currentResponse.status < 300
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : currentResponse.status >= 400
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {currentResponse.status} {currentResponse.statusText}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {currentResponse.responseTime}ms
              </span>
              <button
                onClick={handleCopy}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
              >
                复制
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Response tabs */}
      {currentResponse && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 px-4">
            <button
              onClick={() => setActiveTab("body")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "body"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Body
            </button>
            <button
              onClick={() => setActiveTab("headers")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "headers"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Headers
            </button>
          </div>
        </div>
      )}

      {/* Response content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-gray-500 dark:text-gray-400">
                正在发送请求...
              </div>
            </div>
          </div>
        ) : currentResponse ? (
          <>
            {activeTab === "body" && (
              <pre className="text-sm text-gray-900 dark:text-gray-100 font-mono leading-relaxed">
                {formatJson(currentResponse.data)}
              </pre>
            )}
            {activeTab === "headers" && (
              <div className="space-y-2">
                {Object.entries(currentResponse.headers).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="font-semibold text-gray-700 dark:text-gray-300 w-48 flex-shrink-0">
                      {key}:
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 flex-1 break-all font-mono text-sm">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="text-lg mb-2 font-medium">暂无响应</p>
              <p className="text-sm">发送请求以查看响应内容</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
