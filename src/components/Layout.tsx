import { ReactNode, useEffect } from "react";
import { useRequestStore } from "../store/useRequestStore";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const {
    environments,
    currentEnvironment,
    setCurrentEnvironment,
    theme,
    setTheme,
  } = useRequestStore();

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <div className="h-screen flex flex-col bg-surface dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-surface dark:bg-gray-800 border-b border-outline/20 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Httping
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              v0.1.0
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme selector */}
            <div className="relative">
              <select
                value={theme}
                onChange={(e) =>
                  setTheme(e.target.value as "light" | "dark" | "system")
                }
                className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
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

            {/* Environment selector */}
            <div className="relative">
              <select
                value={currentEnvironment?.id || ""}
                onChange={(e) => {
                  const env = environments.find(
                    (env) => env.id === e.target.value
                  );
                  setCurrentEnvironment(env || null);
                }}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-outline dark:border-gray-600 rounded-lg bg-surface dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all"
              >
                <option value="">No Environment</option>
                {environments.map((env) => (
                  <option key={env.id} value={env.id}>
                    {env.name}
                  </option>
                ))}
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
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  );
}
