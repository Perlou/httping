import { useState } from "react";
import { useRequestStore } from "../store/useRequestStore";
import { parseHeaders, stringifyHeaders } from "../utils/http";
import { AuthConfig } from "./AuthConfig";

type TabType = "headers" | "body" | "auth";

export function RequestTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("headers");
  const { currentRequest, setCurrentRequest } = useRequestStore();

  const [headersText, setHeadersText] = useState(
    stringifyHeaders(currentRequest.headers)
  );

  const handleHeadersChange = (text: string) => {
    setHeadersText(text);
    const headers = parseHeaders(text);
    setCurrentRequest({ headers });
  };

  const handleBodyChange = (text: string) => {
    setCurrentRequest({ body: text });
  };

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 px-4">
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
            onClick={() => setActiveTab("auth")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "auth"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Auth
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "headers" && (
          <div className="h-full p-4">
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              One header per line in format:{" "}
              <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                Key: Value
              </code>
            </div>
            <textarea
              value={headersText}
              onChange={(e) => handleHeadersChange(e.target.value)}
              placeholder="Content-Type: application/json&#10;Authorization: Bearer token123"
              className="w-full h-[calc(100%-2rem)] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
            />
          </div>
        )}

        {activeTab === "body" && (
          <div className="h-full p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Request body (JSON, XML, or plain text)
              </div>
              <select className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>JSON</option>
                <option>Text</option>
                <option>XML</option>
              </select>
            </div>
            <textarea
              value={currentRequest.body || ""}
              onChange={(e) => handleBodyChange(e.target.value)}
              placeholder={
                '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
              }
              className="w-full h-[calc(100%-3rem)] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
            />
          </div>
        )}

        {activeTab === "auth" && (
          <div className="h-full p-4">
            <AuthConfig />
          </div>
        )}
      </div>
    </>
  );
}
