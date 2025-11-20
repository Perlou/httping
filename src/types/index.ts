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

// Environment types
export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
}

// Auth types
export type AuthType = "none" | "bearer" | "basic";

export interface AuthConfig {
  type: AuthType;
  token?: string;
  username?: string;
  password?: string;
}
