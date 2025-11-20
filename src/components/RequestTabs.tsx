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
      <div className="border-b border-outline/20 dark:border-gray-700 bg-surface dark:bg-gray-800">
        <div className="flex px-4">
          {["headers", "body", "auth"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`relative px-6 py-3 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "text-primary dark:text-primary-container"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-surface-variant/30"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-container rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden bg-surface dark:bg-gray-800 p-4">
        {activeTab === "headers" && (
          <div className="h-full flex flex-col gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>Format:</span>
              <code className="px-1.5 py-0.5 bg-surface-variant dark:bg-gray-700 rounded text-primary dark:text-primary-container font-mono text-xs">
                Key: Value
              </code>
            </div>
            <textarea
              value={headersText}
              onChange={(e) => handleHeadersChange(e.target.value)}
              placeholder="Content-Type: application/json&#10;Authorization: Bearer token123"
              className="flex-1 w-full p-4 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
        )}

        {activeTab === "body" && (
          <div className="h-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Request Body
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium border border-outline dark:border-gray-600 rounded-md bg-surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500">
                  <option>JSON</option>
                  <option>Text</option>
                  <option>XML</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-3 h-3 text-gray-500"
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
            </div>
            <textarea
              value={currentRequest.body || ""}
              onChange={(e) => handleBodyChange(e.target.value)}
              placeholder={
                '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
              }
              className="flex-1 w-full p-4 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
        )}

        {activeTab === "auth" && (
          <div className="h-full">
            <AuthConfig />
          </div>
        )}
      </div>
    </>
  );
}
