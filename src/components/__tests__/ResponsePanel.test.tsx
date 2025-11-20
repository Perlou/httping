import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResponsePanel } from "../ResponsePanel";
import { useRequestStore } from "../../store/useRequestStore";

// Mock the store
vi.mock("../../store/useRequestStore", () => ({
  useRequestStore: vi.fn(),
}));

// Mock clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe("ResponsePanel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render empty state when no response", () => {
    (useRequestStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentResponse: null,
      isLoading: false,
    });

    render(<ResponsePanel />);
    expect(screen.getByText("No Response")).toBeInTheDocument();
    expect(
      screen.getByText("Send a request to see the response here")
    ).toBeInTheDocument();
  });

  it("should render loading state", () => {
    (useRequestStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentResponse: null,
      isLoading: true,
    });

    render(<ResponsePanel />);
    expect(screen.getByText("Sending request...")).toBeInTheDocument();
  });

  it("should render response data", () => {
    const mockResponse = {
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json" },
      data: { message: "success" },
      responseTime: 100,
    };

    (useRequestStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentResponse: mockResponse,
      isLoading: false,
    });

    render(<ResponsePanel />);

    // Status
    expect(screen.getByText("200 OK")).toBeInTheDocument();
    // Time
    expect(screen.getByText("100ms")).toBeInTheDocument();
    // Body content
    expect(screen.getByText(/"message": "success"/)).toBeInTheDocument();
  });

  it("should switch between body and headers", () => {
    const mockResponse = {
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json" },
      data: {},
      responseTime: 100,
    };

    (useRequestStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentResponse: mockResponse,
      isLoading: false,
    });

    render(<ResponsePanel />);

    // Default is body
    expect(screen.getByText("Body")).toHaveClass("text-primary");

    // Switch to headers
    fireEvent.click(screen.getByText("Headers"));
    expect(screen.getByText("content-type")).toBeInTheDocument();
    expect(screen.getByText("application/json")).toBeInTheDocument();
  });

  it("should copy response to clipboard", async () => {
    const mockResponse = {
      status: 200,
      statusText: "OK",
      headers: {},
      data: { test: true },
      responseTime: 100,
    };

    (useRequestStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentResponse: mockResponse,
      isLoading: false,
    });

    render(<ResponsePanel />);

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining('"test": true')
    );

    // Should show "Copied!"
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });
});
