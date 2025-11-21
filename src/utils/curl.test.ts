import { describe, it, expect } from "vitest";
import { parseCurlCommand } from "./curl";
import { HttpMethod } from "../types";

describe("parseCurlCommand", () => {
  describe("Basic parsing", () => {
    it("should parse a simple GET request", () => {
      const curl = `curl -X GET https://api.example.com/users`;
      const result = parseCurlCommand(curl);

      expect(result.request.method).toBe("GET");
      expect(result.request.url).toBe("https://api.example.com/users");
      expect(result.request.headers).toEqual({});
      expect(result.request.body).toBeUndefined();
      expect(result.authConfig).toBeUndefined();
    });

    it("should parse GET request without explicit method", () => {
      const curl = `curl https://api.example.com/users`;
      const result = parseCurlCommand(curl);

      expect(result.request.method).toBe("GET");
      expect(result.request.url).toBe("https://api.example.com/users");
    });

    it("should parse a POST request with JSON data", () => {
      const curl = `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"John","age":30}'`;
      const result = parseCurlCommand(curl);

      expect(result.request.method).toBe("POST");
      expect(result.request.url).toBe("https://api.example.com/users");
      expect(result.request.headers["Content-Type"]).toBe("application/json");
      expect(result.request.body).toContain("John");
      expect(result.request.body).toContain("30");
    });

    it("should parse PUT, DELETE, and PATCH methods", () => {
      const methods: HttpMethod[] = ["PUT", "DELETE", "PATCH"];

      methods.forEach((method) => {
        const curl = `curl -X ${method} https://api.example.com/resource`;
        const result = parseCurlCommand(curl);
        expect(result.request.method).toBe(method);
      });
    });
  });

  describe("Headers parsing", () => {
    it("should parse multiple headers", () => {
      const curl = `curl https://api.example.com/users -H "Content-Type: application/json" -H "Accept: application/json" -H "X-Custom-Header: value"`;
      const result = parseCurlCommand(curl);

      expect(result.request.headers["Content-Type"]).toBe("application/json");
      expect(result.request.headers["Accept"]).toBe("application/json");
      expect(result.request.headers["X-Custom-Header"]).toBe("value");
    });

    it("should handle headers with --header flag", () => {
      const curl = `curl https://api.example.com/users --header "Authorization: Bearer token123"`;
      const result = parseCurlCommand(curl);

      expect(result.request.headers["Authorization"]).toBe("Bearer token123");
    });
  });

  describe("Authentication parsing", () => {
    it("should extract Bearer token from Authorization header", () => {
      const curl = `curl https://api.example.com/users -H "Authorization: Bearer my-secret-token"`;
      const result = parseCurlCommand(curl);

      expect(result.authConfig).toBeDefined();
      expect(result.authConfig?.type).toBe("bearer");
      expect(result.authConfig?.token).toBe("my-secret-token");
    });

    it("should extract Basic auth credentials from -u flag", () => {
      const curl = `curl -u username:password https://api.example.com/users`;
      const result = parseCurlCommand(curl);

      expect(result.authConfig).toBeDefined();
      expect(result.authConfig?.type).toBe("basic");
      expect(result.authConfig?.username).toBe("username");
      expect(result.authConfig?.password).toBe("password");
    });

    it("should extract Basic auth from Authorization header", () => {
      // Base64 encoded "user:pass" = "dXNlcjpwYXNz"
      const curl = `curl -H "Authorization: Basic dXNlcjpwYXNz" https://api.example.com/users`;
      const result = parseCurlCommand(curl);

      expect(result.authConfig).toBeDefined();
      expect(result.authConfig?.type).toBe("basic");
      expect(result.authConfig?.username).toBe("user");
      expect(result.authConfig?.password).toBe("pass");
    });
  });

  describe("Request body parsing", () => {
    it("should parse JSON body with -d flag", () => {
      const curl = `curl -X POST https://api.example.com/posts -d '{"title":"Test"}'`;
      const result = parseCurlCommand(curl);

      expect(result.request.body).toBeDefined();
      expect(result.request.body).toContain("title");
      expect(result.request.body).toContain("Test");
    });

    it("should parse form data", () => {
      const curl = `curl -X POST https://api.example.com/form -d "name=John&email=john@example.com"`;
      const result = parseCurlCommand(curl);

      expect(result.request.body).toBeDefined();
      expect(result.request.body).toContain("name");
      expect(result.request.body).toContain("John");
    });

    it("should handle --data flag", () => {
      const curl = `curl -X POST https://api.example.com/data --data '{"key":"value"}'`;
      const result = parseCurlCommand(curl);

      expect(result.request.body).toBeDefined();
      expect(result.request.body).toContain("key");
    });
  });

  describe("Error handling", () => {
    it("should throw error for empty string", () => {
      expect(() => parseCurlCommand("")).toThrow(
        "cURL command cannot be empty"
      );
    });

    it("should throw error for whitespace-only string", () => {
      expect(() => parseCurlCommand("   ")).toThrow(
        "cURL command cannot be empty"
      );
    });

    it("should throw error for URLs without protocol", () => {
      // Our custom parser requires something that looks like a URL
      const curl = `curl not-a-valid-url`;
      expect(() => parseCurlCommand(curl)).toThrow("No URL found");
    });

    it("should throw error for non-HTTP(S) protocol", () => {
      const curl = `curl ftp://example.com/file`;
      expect(() => parseCurlCommand(curl)).toThrow(
        "Only HTTP and HTTPS protocols are supported"
      );
    });

    it("should throw error for completely invalid cURL command", () => {
      const curl = `this is not a curl command at all`;
      expect(() => parseCurlCommand(curl)).toThrow("No URL found");
    });
  });

  describe("Complex real-world examples", () => {
    it("should parse JSONPlaceholder POST example", () => {
      const curl = `curl -X POST https://jsonplaceholder.typicode.com/posts \\
        -H "Content-Type: application/json" \\
        -H "Authorization: Bearer test-token-123" \\
        -d '{"title": "foo", "body": "bar", "userId": 1}'`;

      const result = parseCurlCommand(curl);

      expect(result.request.method).toBe("POST");
      expect(result.request.url).toBe(
        "https://jsonplaceholder.typicode.com/posts"
      );
      expect(result.request.headers["Content-Type"]).toBe("application/json");
      expect(result.request.body).toContain("foo");
      expect(result.request.body).toContain("bar");
      expect(result.authConfig?.type).toBe("bearer");
      expect(result.authConfig?.token).toBe("test-token-123");
    });

    it("should parse httpbin basic auth example", () => {
      const curl = `curl -u user:password https://httpbin.org/basic-auth/user/password`;

      const result = parseCurlCommand(curl);

      expect(result.request.url).toBe(
        "https://httpbin.org/basic-auth/user/password"
      );
      expect(result.authConfig?.type).toBe("basic");
      expect(result.authConfig?.username).toBe("user");
      expect(result.authConfig?.password).toBe("password");
    });
  });
});
