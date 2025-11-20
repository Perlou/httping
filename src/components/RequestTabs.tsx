import { useState, useEffect, useRef } from "react";
import { useRequestStore } from "../store/useRequestStore";
import { parseHeaders, stringifyHeaders } from "../utils/http";
import { AuthConfig } from "./AuthConfig";

type TabType = "params" | "headers" | "body" | "auth";

interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

// Default templates
const DEFAULT_HEADERS_TEMPLATE = `Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE`;

const DEFAULT_BODY_TEMPLATE = `{
  "name": "John Doe",
  "email": "john@example.com"
}`;

// Parse URL to extract query parameters
function parseUrlParams(url: string): QueryParam[] {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `http://${url}`);
    const params: QueryParam[] = [];
    urlObj.searchParams.forEach((value, key) => {
      params.push({ key, value, enabled: true });
    });
    return params;
  } catch {
    return [];
  }
}

// Build URL with query parameters
function buildUrlWithParams(baseUrl: string, params: QueryParam[]): string {
  try {
    const url = new URL(
      baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`
    );
    url.search = ""; // Clear existing params
    params.forEach((param) => {
      if (param.enabled && param.key) {
        url.searchParams.append(param.key, param.value);
      }
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export function RequestTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("params");
  const { currentRequest, setCurrentRequest } = useRequestStore();

  const [headersText, setHeadersText] = useState(
    stringifyHeaders(currentRequest.headers)
  );

  const [queryParams, setQueryParams] = useState<QueryParam[]>(() => {
    const params = parseUrlParams(currentRequest.url);
    return params.length > 0 ? params : [{ key: "", value: "", enabled: true }];
  });

  // Use ref to track the source of updates to prevent infinite loops
  const isUpdatingFromParams = useRef(false);
  const previousUrl = useRef(currentRequest.url);

  // Sync URL -> Params (when user types in URL input)
  useEffect(() => {
    if (
      !isUpdatingFromParams.current &&
      currentRequest.url !== previousUrl.current
    ) {
      const newParams = parseUrlParams(currentRequest.url);
      if (newParams.length > 0) {
        setQueryParams(newParams);
      } else if (currentRequest.url && !currentRequest.url.includes("?")) {
        // URL has no params, keep one empty row
        setQueryParams([{ key: "", value: "", enabled: true }]);
      }
      previousUrl.current = currentRequest.url;
    }
  }, [currentRequest.url]);

  // Sync Params -> URL (when user edits in Params table)
  useEffect(() => {
    const hasParams = queryParams.some((p) => p.key && p.enabled);
    if (hasParams) {
      isUpdatingFromParams.current = true;
      const baseUrl = currentRequest.url.split("?")[0];
      const newUrl = buildUrlWithParams(baseUrl, queryParams);
      if (newUrl !== currentRequest.url) {
        setCurrentRequest({ url: newUrl });
        previousUrl.current = newUrl;
      }
      // Reset flag after a tick
      setTimeout(() => {
        isUpdatingFromParams.current = false;
      }, 0);
    } else {
      // No enabled params, remove query string from URL
      isUpdatingFromParams.current = true;
      const baseUrl = currentRequest.url.split("?")[0];
      if (baseUrl !== currentRequest.url) {
        setCurrentRequest({ url: baseUrl });
        previousUrl.current = baseUrl;
      }
      setTimeout(() => {
        isUpdatingFromParams.current = false;
      }, 0);
    }
  }, [queryParams]);

  const handleHeadersChange = (text: string) => {
    setHeadersText(text);
    const headers = parseHeaders(text);
    setCurrentRequest({ headers });
  };

  const handleBodyChange = (text: string) => {
    setCurrentRequest({ body: text });
  };

  const resetHeadersToTemplate = () => {
    handleHeadersChange(DEFAULT_HEADERS_TEMPLATE);
  };

  const resetBodyToTemplate = () => {
    handleBodyChange(DEFAULT_BODY_TEMPLATE);
  };

  const clearHeaders = () => {
    handleHeadersChange("");
  };

  const clearBody = () => {
    handleBodyChange("");
  };

  // Query params handlers
  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "", enabled: true }]);
  };

  const updateQueryParam = (
    index: number,
    field: keyof QueryParam,
    value: string | boolean
  ) => {
    const updated = [...queryParams];
    updated[index] = { ...updated[index], [field]: value };
    setQueryParams(updated);
  };

  const deleteQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const clearAllParams = () => {
    setQueryParams([{ key: "", value: "", enabled: true }]);
    setCurrentRequest({ url: currentRequest.url.split("?")[0] });
  };

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-outline/20 dark:border-gray-700 bg-surface dark:bg-gray-800">
        <div className="flex px-4">
          {["params", "headers", "body", "auth"].map((tab) => (
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
        {activeTab === "params" && (
          <div className="h-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Query Parameters
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={addQueryParam}
                  className="px-3 py-1.5 text-xs font-medium text-primary dark:text-primary-container hover:bg-primary-container/20 dark:hover:bg-primary-container/10 rounded-md transition-colors flex items-center gap-1"
                  title="Add parameter"
                >
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add
                </button>
                <button
                  onClick={clearAllParams}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-1"
                  title="Clear all"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto border border-outline/20 dark:border-gray-600 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-surface-variant/30 dark:bg-gray-700/30 sticky top-0">
                  <tr>
                    <th className="w-12 px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300"></th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Key
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Value
                    </th>
                    <th className="w-12 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {queryParams.map((param, index) => (
                    <tr
                      key={index}
                      className="border-t border-outline/10 dark:border-gray-700 hover:bg-surface-variant/20 dark:hover:bg-gray-700/20"
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          onChange={(e) =>
                            updateQueryParam(index, "enabled", e.target.checked)
                          }
                          className="w-4 h-4 rounded border-outline dark:border-gray-600 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) =>
                            updateQueryParam(index, "key", e.target.value)
                          }
                          placeholder="key"
                          className="w-full px-2 py-1 border border-outline dark:border-gray-600 rounded bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) =>
                            updateQueryParam(index, "value", e.target.value)
                          }
                          placeholder="value"
                          className="w-full px-2 py-1 border border-outline dark:border-gray-600 rounded bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => deleteQueryParam(index)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "headers" && (
          <div className="h-full flex flex-col gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Format:</span>
                <code className="px-1.5 py-0.5 bg-surface-variant dark:bg-gray-700 rounded text-primary dark:text-primary-container font-mono text-xs">
                  Key: Value
                </code>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetHeadersToTemplate}
                  className="px-3 py-1 text-xs font-medium text-primary dark:text-primary-container hover:bg-primary-container/20 dark:hover:bg-primary-container/10 rounded-md transition-colors flex items-center gap-1"
                  title="Reset to template"
                >
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
                <button
                  onClick={clearHeaders}
                  className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-1"
                  title="Clear all"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear
                </button>
              </div>
            </div>
            <textarea
              value={headersText}
              onChange={(e) => handleHeadersChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const newValue =
                    headersText.substring(0, start) +
                    "  " +
                    headersText.substring(end);

                  // Update the state
                  handleHeadersChange(newValue);

                  // Set cursor position after state update
                  requestAnimationFrame(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                  });
                }
              }}
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
              <div className="flex items-center gap-1">
                <button
                  onClick={resetBodyToTemplate}
                  className="px-3 py-1.5 text-xs font-medium text-primary dark:text-primary-container hover:bg-primary-container/20 dark:hover:bg-primary-container/10 rounded-md transition-colors flex items-center gap-1"
                  title="Reset to template"
                >
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
                <button
                  onClick={clearBody}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-1"
                  title="Clear all"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear
                </button>
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
            </div>
            <textarea
              value={currentRequest.body || ""}
              onChange={(e) => handleBodyChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const currentBody = currentRequest.body || "";
                  const newValue =
                    currentBody.substring(0, start) +
                    "  " +
                    currentBody.substring(end);

                  // Update the state
                  handleBodyChange(newValue);

                  // Set cursor position after state update
                  requestAnimationFrame(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                  });
                }
              }}
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
