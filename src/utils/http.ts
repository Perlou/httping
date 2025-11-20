import axios, { AxiosError, AxiosRequestConfig } from "axios";
import type { HttpRequest, HttpResponse, AuthConfig } from "../types";

/**
 * Send an HTTP request using axios
 */
export async function sendHttpRequest(
  request: HttpRequest,
  authConfig?: AuthConfig
): Promise<HttpResponse> {
  const startTime = Date.now();

  try {
    // Apply auth configuration to headers
    const headers = { ...request.headers };
    let url = request.url;

    if (authConfig && authConfig.type !== "none") {
      // Bearer Token
      if (authConfig.type === "bearer" && authConfig.token) {
        headers["Authorization"] = `Bearer ${authConfig.token}`;
      }
      // JWT (same as Bearer)
      else if (authConfig.type === "jwt" && authConfig.token) {
        headers["Authorization"] = `Bearer ${authConfig.token}`;
      }
      // Basic Auth
      else if (
        authConfig.type === "basic" &&
        authConfig.username &&
        authConfig.password
      ) {
        const credentials = btoa(
          `${authConfig.username}:${authConfig.password}`
        );
        headers["Authorization"] = `Basic ${credentials}`;
      }
      // API Key
      else if (
        authConfig.type === "apikey" &&
        authConfig.apiKey &&
        authConfig.apiKeyName
      ) {
        if (authConfig.apiKeyLocation === "header") {
          // Add to header
          headers[authConfig.apiKeyName] = authConfig.apiKey;
        } else if (authConfig.apiKeyLocation === "query") {
          // Add to query parameter
          const urlObj = new URL(url);
          urlObj.searchParams.set(authConfig.apiKeyName, authConfig.apiKey);
          url = urlObj.toString();
        }
      }
      // OAuth 2.0
      else if (authConfig.type === "oauth2" && authConfig.accessToken) {
        const tokenType = authConfig.tokenType || "Bearer";
        headers["Authorization"] = `${tokenType} ${authConfig.accessToken}`;
      }
    }

    // Build axios config
    const config: AxiosRequestConfig = {
      url,
      method: request.method,
      headers,
      data: request.body ? JSON.parse(request.body) : undefined,
      // Don't throw on any status code
      validateStatus: () => true,
    };

    // Send request
    const response = await axios(config);

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Build response object
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      data: response.data,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Handle network errors or other errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      return {
        status: axiosError.response?.status || 0,
        statusText: axiosError.message,
        headers: (axiosError.response?.headers as Record<string, string>) || {},
        data: {
          error: axiosError.message,
          details:
            axiosError.response?.data || "Network error or request failed",
        },
        responseTime,
      };
    }

    // Handle other errors (e.g., JSON parse errors)
    return {
      status: 0,
      statusText: "Request Failed",
      headers: {},
      data: {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      responseTime,
    };
  }
}

/**
 * Replace environment variables in a string
 * Example: "{{baseUrl}}/users" -> "https://api.example.com/users"
 */
export function replaceEnvVariables(
  text: string,
  variables: Record<string, string>
): string {
  let result = text;

  // Replace all {{variableName}} with their values
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, value);
  });

  return result;
}

/**
 * Format JSON data for display
 */
export function formatJson(data: any): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

/**
 * Parse headers from string format (key: value)
 */
export function parseHeaders(headersText: string): Record<string, string> {
  const headers: Record<string, string> = {};

  headersText.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) return;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();

    if (key) {
      headers[key] = value;
    }
  });

  return headers;
}

/**
 * Stringify headers to text format
 */
export function stringifyHeaders(headers: Record<string, string>): string {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}
