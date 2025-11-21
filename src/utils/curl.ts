import { HttpRequest, HttpMethod, AuthConfig } from "../types";

/**
 * Result of parsing a cURL command
 */
export interface ParsedCurlResult {
  request: HttpRequest;
  authConfig?: AuthConfig;
}

/**
 * Parse a cURL command string into an HttpRequest object
 * This is a simplified parser that handles common cURL patterns
 * @param curlString - The cURL command string to parse
 * @returns Parsed request and optional auth configuration
 * @throws Error if the cURL command is invalid or cannot be parsed
 */
export function parseCurlCommand(curlString: string): ParsedCurlResult {
  if (!curlString || !curlString.trim()) {
    throw new Error("cURL command cannot be empty");
  }

  // Remove 'curl' prefix and normalize whitespace
  let cmd = curlString.trim();
  if (cmd.startsWith("curl ")) {
    cmd = cmd.substring(5);
  }

  // Parse the command
  const result = {
    url: "",
    method: "GET" as HttpMethod,
    headers: {} as Record<string, string>,
    data: undefined as string | undefined,
    username: undefined as string | undefined,
    password: undefined as string | undefined,
  };

  // Split by spaces, but respect quoted strings
  const tokens = tokenize(cmd);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Method (-X or --request)
    if (token === "-X" || token === "--request") {
      result.method = tokens[++i]?.toUpperCase() as HttpMethod;
      continue;
    }

    // Headers (-H or --header)
    if (token === "-H" || token === "--header") {
      const header = tokens[++i];
      if (header) {
        const colonIndex = header.indexOf(":");
        if (colonIndex > 0) {
          const key = header.substring(0, colonIndex).trim();
          const value = header.substring(colonIndex + 1).trim();
          result.headers[key] = value;
        }
      }
      continue;
    }

    // Data (-d, --data, --data-raw, --data-binary)
    if (
      token === "-d" ||
      token === "--data" ||
      token === "--data-raw" ||
      token === "--data-binary"
    ) {
      result.data = tokens[++i];
      continue;
    }

    // User authentication (-u or --user)
    if (token === "-u" || token === "--user") {
      const userPass = tokens[++i];
      if (userPass) {
        const parts = userPass.split(":");
        result.username = parts[0];
        result.password = parts[1] || "";
      }
      continue;
    }

    // Skip other flags
    if (token.startsWith("-")) {
      // Skip this flag and potentially its value
      if (
        i + 1 < tokens.length &&
        !tokens[i + 1].startsWith("-") &&
        !isUrl(tokens[i + 1])
      ) {
        i++; // Skip the value
      }
      continue;
    }

    // If not a flag, it's likely the URL
    if (isUrl(token) && !result.url) {
      result.url = token;
    }
  }

  // Validate we have a URL
  if (!result.url) {
    throw new Error("No URL found in cURL command");
  }

  // Check if URL already has a protocol
  const hasProtocol = /^[a-z]+:\/\//i.test(result.url);

  // Auto-prepend http:// if no protocol
  if (!hasProtocol) {
    result.url = `http://${result.url}`;
  }

  // Validate URL and protocol
  try {
    const urlObj = new URL(result.url);
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      throw new Error("Only HTTP and HTTPS protocols are supported");
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("HTTP")) {
      throw e;
    }
    throw new Error("Invalid URL in cURL command");
  }

  // Validate method
  const validMethods: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  if (!validMethods.includes(result.method)) {
    throw new Error(`Unsupported HTTP method: ${result.method}`);
  }

  // Build HttpRequest object
  const request: HttpRequest = {
    id: crypto.randomUUID(),
    url: result.url,
    method: result.method,
    headers: result.headers,
    body: result.data,
    timestamp: Date.now(),
  };

  // Extract auth configuration
  const authConfig = extractAuthConfig(
    result.headers,
    result.username,
    result.password
  );

  return {
    request,
    authConfig,
  };
}

/**
 * Tokenize cURL command, respecting quoted strings
 */
function tokenize(cmd: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";
  let escaped = false;

  for (let i = 0; i < cmd.length; i++) {
    const char = cmd[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if ((char === '"' || char === "'") && !inQuote) {
      inQuote = true;
      quoteChar = char;
      continue;
    }

    if (char === quoteChar && inQuote) {
      inQuote = false;
      quoteChar = "";
      continue;
    }

    if (char === " " && !inQuote) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Check if a string looks like a URL
 */
function isUrl(str: string): boolean {
  return (
    str.includes("://") ||
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.includes(".") ||
    str.startsWith("localhost")
  );
}

/**
 * Extract authentication configuration from headers and -u flag
 */
function extractAuthConfig(
  headers: Record<string, string>,
  username?: string,
  password?: string
): AuthConfig | undefined {
  // Check for Basic auth from -u flag
  if (username !== undefined) {
    return {
      type: "basic",
      username,
      password: password || "",
    };
  }

  // Check for Authorization header
  const authHeader = headers["Authorization"] || headers["authorization"];

  if (authHeader) {
    // Bearer token
    if (authHeader.startsWith("Bearer ")) {
      return {
        type: "bearer",
        token: authHeader.substring(7),
      };
    }

    // Basic auth
    if (authHeader.startsWith("Basic ")) {
      try {
        const credentials = atob(authHeader.substring(6));
        const [user, pass] = credentials.split(":");
        return {
          type: "basic",
          username: user,
          password: pass,
        };
      } catch {
        // If decoding fails, just ignore
      }
    }
  }

  return undefined;
}
