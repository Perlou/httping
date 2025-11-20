import { useRequestStore } from "../store/useRequestStore";

export function AuthConfig() {
  const { authConfig, setAuthConfig } = useRequestStore();

  const handleAuthTypeChange = (type: string) => {
    setAuthConfig({
      ...authConfig,
      type: type as any,
    });
  };

  const handleTokenChange = (token: string) => {
    setAuthConfig({
      ...authConfig,
      token,
    });
  };

  const handleUsernameChange = (username: string) => {
    setAuthConfig({
      ...authConfig,
      username,
    });
  };

  const handlePasswordChange = (password: string) => {
    setAuthConfig({
      ...authConfig,
      password,
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
            <option value="bearer">Bearer Token</option>
            <option value="basic">Basic Auth</option>
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

      {authConfig.type === "bearer" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Token
          </label>
          <input
            type="text"
            value={authConfig.token || ""}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder="Enter your bearer token"
            className="w-full px-4 py-2.5 border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 dark:hover:border-gray-500"
          />
        </div>
      )}

      {authConfig.type === "basic" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={authConfig.username || ""}
              onChange={(e) => handleUsernameChange(e.target.value)}
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
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Password"
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
            The Authorization header will be automatically added to your
            request.
          </div>
        </div>
      )}
    </div>
  );
}
