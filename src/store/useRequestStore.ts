import { create } from "zustand";
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
  clearHistory: () => void;

  // Environments
  environments: Environment[];
  currentEnvironment: Environment | null;
  setCurrentEnvironment: (env: Environment | null) => void;

  // Auth
  authConfig: AuthConfig;
  setAuthConfig: (config: AuthConfig) => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
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
    set((state) => ({ history: [item, ...state.history] })),
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

  authConfig: { type: "none" },
  setAuthConfig: (config) => set({ authConfig: config }),
}));
