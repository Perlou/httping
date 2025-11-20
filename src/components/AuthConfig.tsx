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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          认证类型
        </label>
        <select
          value={authConfig.type}
          onChange={(e) => handleAuthTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="none">无认证</option>
          <option value="bearer">Bearer Token</option>
          <option value="basic">Basic Auth</option>
        </select>
      </div>

      {authConfig.type === "bearer" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token
          </label>
          <input
            type="text"
            value={authConfig.token || ""}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder="输入你的 token"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {authConfig.type === "basic" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={authConfig.username || ""}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="输入用户名"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              密码
            </label>
            <input
              type="password"
              value={authConfig.password || ""}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="输入密码"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}

      {authConfig.type !== "none" && (
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
          💡 Authorization header 会自动添加到你的请求中
        </div>
      )}
    </div>
  );
}
