import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  replaceEnvVariables,
  formatJson,
  parseHeaders,
  stringifyHeaders,
  sendHttpRequest,
} from "./http";

vi.mock("axios");

describe("http utils", () => {
  describe("replaceEnvVariables", () => {
    it("should replace variables in text", () => {
      const text = "{{baseUrl}}/users/{{userId}}";
      const variables = {
        baseUrl: "https://api.example.com",
        userId: "123",
      };
      const result = replaceEnvVariables(text, variables);
      expect(result).toBe("https://api.example.com/users/123");
    });

    it("should handle text without variables", () => {
      const text = "https://api.example.com/users";
      const variables = { baseUrl: "https://api.example.com" };
      const result = replaceEnvVariables(text, variables);
      expect(result).toBe(text);
    });

    it("should handle missing variables", () => {
      const text = "{{baseUrl}}/users";
      const variables = {};
      const result = replaceEnvVariables(text, variables);
      expect(result).toBe(text);
    });
  });

  describe("formatJson", () => {
    it("should format valid JSON object", () => {
      const data = { name: "test", value: 123 };
      const result = formatJson(data);
      expect(result).toBe(JSON.stringify(data, null, 2));
    });

    it("should return string representation for non-JSON data", () => {
      const data = "not json";
      const result = formatJson(data);
      expect(result).toBe('"not json"');
    });
  });

  describe("parseHeaders", () => {
    it("should parse valid headers string", () => {
      const text =
        "Content-Type: application/json\nAuthorization: Bearer token";
      const result = parseHeaders(text);
      expect(result).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      });
    });

    it("should ignore empty lines", () => {
      const text =
        "Content-Type: application/json\n\nAuthorization: Bearer token\n";
      const result = parseHeaders(text);
      expect(result).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      });
    });

    it("should ignore lines without colon", () => {
      const text = "Content-Type: application/json\nInvalid Line";
      const result = parseHeaders(text);
      expect(result).toEqual({
        "Content-Type": "application/json",
      });
    });
  });

  describe("stringifyHeaders", () => {
    it("should stringify headers object", () => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      };
      const result = stringifyHeaders(headers);
      expect(result).toContain("Content-Type: application/json");
      expect(result).toContain("Authorization: Bearer token");
    });
  });

  describe("sendHttpRequest", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should send a GET request successfully", async () => {
      const mockResponse = {
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        data: { message: "success" },
      };
      (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockResponse
      );

      const request = {
        id: "1",
        name: "Test Request",
        url: "https://api.example.com/test",
        method: "GET",
        headers: {},
        body: "",
      };

      const response = await sendHttpRequest(request);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/test",
          method: "GET",
        })
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: "success" });
    });

    it("should handle request failure", async () => {
      const mockError = {
        isAxiosError: true,
        message: "Network Error",
        response: undefined,
      };
      (axios as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
        mockError
      );
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(true);

      const request = {
        id: "1",
        name: "Test Request",
        url: "https://api.example.com/fail",
        method: "GET",
        headers: {},
        body: "",
      };

      const response = await sendHttpRequest(request);

      expect(response.status).toBe(0);
      expect(response.data.error).toBe("Network Error");
    });
  });
});
