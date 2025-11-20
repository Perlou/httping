import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  HttpRequest,
  HttpResponse,
  HistoryItem,
  Environment,
  AuthConfig,
} from "../types";

interface RequestStore {
  // Current request
  currentRequest: HttpRequest;
  setCurrentRequest: (request: Partial<HttpRequest>) => void;

  // Response
  currentResponse: HttpResponse | null;
  setCurrentResponse: (response: HttpResponse | null) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // History
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (requestId: string) => void;
  clearHistory: () => void;

  // Environments
  environments: Environment[];
  currentEnvironment: Environment | null;
  setCurrentEnvironment: (env: Environment | null) => void;

  // Auth
  authConfig: AuthConfig;
  setAuthConfig: (config: AuthConfig) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set) => ({
      // Initial state
      currentRequest: {
        id: crypto.randomUUID(),
        url: "",
        method: "GET",
        headers: {},
        timestamp: Date.now(),
      },

      setCurrentRequest: (request) =>
        set((state) => ({
          currentRequest: { ...state.currentRequest, ...request },
        })),

      currentResponse: null,
      setCurrentResponse: (response) => set({ currentResponse: response }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      history: [],
      addToHistory: (item) =>
        set((state) => {
          if (state.history.length >= 20) {
            throw new Error(
              "History limit reached (20 items). Please delete some items to save new requests."
            );
          }
          return { history: [item, ...state.history] };
        }),
      removeFromHistory: (requestId) =>
        set((state) => ({
          history: state.history.filter(
            (item) => item.request.id !== requestId
          ),
        })),
      clearHistory: () => set({ history: [] }),

      environments: [
        {
          id: "dev",
          name: "Development",
          variables: {
            baseUrl: "http://localhost:3000",
          },
        },
        {
          id: "prod",
          name: "Production",
          variables: {
            baseUrl: "https://api.example.com",
          },
        },
      ],
      currentEnvironment: null,
      setCurrentEnvironment: (env) => set({ currentEnvironment: env }),

      authConfig: {
        type: "none",
      },
      setAuthConfig: (config) => set({ authConfig: config }),

      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "httping-storage",
      partialize: (state) => ({
        history: state.history,
        environments: state.environments,
        authConfig: state.authConfig,
        theme: state.theme,
      }),
    }
  )
);
