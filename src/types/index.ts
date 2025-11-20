// HTTP Method types
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Request types
export interface HttpRequest {
  id: string;
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
}

// Response types
export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
}

// History item
export interface HistoryItem {
  request: HttpRequest;
  response?: HttpResponse;
  timestamp: number;
}

// Saved Request Template
export interface SavedRequest {
  id: string;
  name: string;
  request: HttpRequest;
  authConfig?: AuthConfig;
  createdAt: number;
  updatedAt: number;
}

// Environment types
export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
}

// Auth types
export type AuthType =
  | "none"
  | "bearer"
  | "basic"
  | "apikey"
  | "jwt"
  | "oauth2";

export interface AuthConfig {
  type: AuthType;
  // Bearer Token & JWT
  token?: string;
  // Basic Auth
  username?: string;
  password?: string;
  // API Key
  apiKey?: string;
  apiKeyName?: string;
  apiKeyLocation?: "header" | "query";
  // OAuth 2.0
  accessToken?: string;
  tokenType?: string;
}
