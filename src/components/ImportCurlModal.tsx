import { useState } from "react";
import { parseCurlCommand, ParsedCurlResult } from "../utils/curl";

interface ImportCurlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (result: ParsedCurlResult) => void;
}

export function ImportCurlModal({
  isOpen,
  onClose,
  onImport,
}: ImportCurlModalProps) {
  const [curlText, setCurlText] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImport = () => {
    if (!curlText.trim()) {
      setError("Please enter a cURL command");
      return;
    }

    try {
      const result = parseCurlCommand(curlText);
      onImport(result);
      // Reset state and close modal
      setCurlText("");
      setError("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to parse cURL command"
      );
    }
  };

  const handleClose = () => {
    setCurlText("");
    setError("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleImport();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-surface dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-outline/20 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline/20 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              导入 cURL 命令
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            粘贴您的 cURL 命令，自动解析为 HTTP 请求
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            value={curlText}
            onChange={(e) => {
              setCurlText(e.target.value);
              setError(""); // Clear error on change
            }}
            onKeyDown={handleKeyDown}
            placeholder={`curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token" \\
  -d '{"name": "John", "age": 30}'`}
            className="w-full h-64 px-4 py-3 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none"
            autoFocus
          />

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Helper Text */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <span className="font-semibold">提示：</span> 支持
              GET/POST/PUT/DELETE/PATCH 方法、Headers、Body、Basic Auth 和
              Bearer Token
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline/20 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-outline dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleImport}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-lg transition-all shadow-sm hover:shadow-md active:shadow-none flex items-center gap-2"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span>导入 (⌘/Ctrl + Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
