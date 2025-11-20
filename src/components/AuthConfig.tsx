import { useRequestStore } from "../store/useRequestStore";

export function AuthConfig() {
  const { authConfig, setAuthConfig } = useRequestStore();

  const handleAuthTypeChange = (type: string) => {
    setAuthConfig({
      type: type as any,
      // Reset fields when changing type
      token: undefined,
      username: undefined,
      password: undefined,
      apiKey: undefined,
      apiKeyName: type === "apikey" ? "X-API-Key" : undefined,
      apiKeyLocation: type === "apikey" ? "header" : undefined,
      accessToken: undefined,
      tokenType: type === "oauth2" ? "Bearer" : undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pt-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Authentication Type
        </label>
        <div className="relative">
          <select
            value={authConfig.type}
            onChange={(e) => handleAuthTypeChange(e.target.value)}
            className="appearance-none w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer transition-all hover:border-gray-400 dark:hover:border-gray-500"
          >
            <option value="none">No Auth</option>
            <option value="apikey">API Key</option>
            <option value="bearer">Bearer Token</option>
            <option value="jwt">JWT Bearer</option>
            <option value="basic">Basic Auth</option>
            <option value="oauth2">OAuth 2.0</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
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
      </div>

      {/* API Key */}
      {authConfig.type === "apikey" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Name
            </label>
            <input
              type="text"
              value={authConfig.apiKeyName || ""}
              onChange={(e) =>
                setAuthConfig({ ...authConfig, apiKeyName: e.target.value })
              }
              placeholder="e.g., X-API-Key"
              className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Value
            </label>
            <input
              type="text"
              value={authConfig.apiKey || ""}
              onChange={(e) =>
                setAuthConfig({ ...authConfig, apiKey: e.target.value })
              }
              placeholder="Enter your API key"
              className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Add to
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={authConfig.apiKeyLocation === "header"}
                  onChange={() =>
                    setAuthConfig({ ...authConfig, apiKeyLocation: "header" })
                  }
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Header
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={authConfig.apiKeyLocation === "query"}
                  onChange={() =>
                    setAuthConfig({ ...authConfig, apiKeyLocation: "query" })
                  }
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Query Params
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Bearer Token */}
      {authConfig.type === "bearer" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Token
          </label>
          <input
            type="text"
            value={authConfig.token || ""}
            onChange={(e) =>
              setAuthConfig({ ...authConfig, token: e.target.value })
            }
            placeholder="Enter your bearer token"
            className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 dark:hover:border-gray-500"
          />
        </div>
      )}

      {/* JWT */}
      {authConfig.type === "jwt" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JWT Token
          </label>
          <textarea
            value={authConfig.token || ""}
            onChange={(e) =>
              setAuthConfig({ ...authConfig, token: e.target.value })
            }
            placeholder="Enter your JWT token"
            rows={4}
            className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none transition-all hover:border-gray-400 dark:hover:border-gray-500"
          />
        </div>
      )}

      {/* Basic Auth */}
      {authConfig.type === "basic" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={authConfig.username || ""}
              onChange={(e) =>
                setAuthConfig({ ...authConfig, username: e.target.value })
              }
              placeholder="Username"
              className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={authConfig.password || ""}
              onChange={(e) =>
                setAuthConfig({ ...authConfig, password: e.target.value })
              }
              placeholder="Password"
              className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
        </div>
      )}

      {/* OAuth 2.0 */}
      {authConfig.type === "oauth2" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Access Token
            </label>
            <textarea
              value={authConfig.accessToken || ""}
              onChange={(e) =>
                setAuthConfig({ ...authConfig, accessToken: e.target.value })
              }
              placeholder="Enter your OAuth 2.0 access token"
              rows={3}
              className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Token Type
            </label>
            <input
              type="text"
              value={authConfig.tokenType || "Bearer"}
              onChange={(e) =>
                setAuthConfig({ ...authConfig, tokenType: e.target.value })
              }
              placeholder="Bearer"
              className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
        </div>
      )}

      {authConfig.type !== "none" && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary-container/50 text-on-primary-container border border-primary-container">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm">
            {authConfig.type === "apikey" &&
            authConfig.apiKeyLocation === "query"
              ? "The API key will be automatically added as a query parameter to your request."
              : "The authorization will be automatically added to your request headers."}
          </div>
        </div>
      )}
    </div>
  );
}
