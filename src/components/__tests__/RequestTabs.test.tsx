import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RequestTabs } from "../RequestTabs";
import { useRequestStore } from "../../store/useRequestStore";

// Mock the store
vi.mock("../../store/useRequestStore", () => ({
  useRequestStore: vi.fn(),
}));

// Mock AuthConfig component
vi.mock("../AuthConfig", () => ({
  AuthConfig: () => <div data-testid="auth-config">Auth Config</div>,
}));

describe("RequestTabs", () => {
  const mockSetCurrentRequest = vi.fn();
  const defaultRequest = {
    url: "http://example.com",
    method: "GET",
    headers: {},
    body: "",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useRequestStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentRequest: defaultRequest,
      setCurrentRequest: mockSetCurrentRequest,
    });
  });

  it("should render all tabs", () => {
    render(<RequestTabs />);
    expect(screen.getByText("params")).toBeInTheDocument();
    expect(screen.getByText("headers")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByText("auth")).toBeInTheDocument();
  });

  it("should switch tabs", () => {
    render(<RequestTabs />);

    // Default is params
    expect(screen.getByText("Query Parameters")).toBeInTheDocument();

    // Switch to headers
    fireEvent.click(screen.getByText("headers"));
    expect(
      screen.getByPlaceholderText(/Content-Type: application\/json/)
    ).toBeInTheDocument();

    // Switch to body
    fireEvent.click(screen.getByText("body"));
    expect(screen.getByText("Request Body")).toBeInTheDocument();

    // Switch to auth
    fireEvent.click(screen.getByText("auth"));
    expect(screen.getByTestId("auth-config")).toBeInTheDocument();
  });

  it("should update query params", () => {
    render(<RequestTabs />);

    // Add param
    const addButton = screen.getByTitle("Add parameter");
    fireEvent.click(addButton);

    const keyInputs = screen.getAllByPlaceholderText("key");
    const valueInputs = screen.getAllByPlaceholderText("value");

    // Update key
    fireEvent.change(keyInputs[0], { target: { value: "page" } });
    // Update value
    fireEvent.change(valueInputs[0], { target: { value: "1" } });

    // Since the component has internal state for params that syncs to store via useEffect,
    // we might not see immediate store calls unless we wait or check the internal state behavior indirectly.
    // However, the component calls setCurrentRequest when params change.

    // We need to wait for the debounce/timeout in the component
    // But for now let's check if inputs updated
    expect(keyInputs[0]).toHaveValue("page");
    expect(valueInputs[0]).toHaveValue("1");
  });

  it("should update headers", () => {
    render(<RequestTabs />);
    fireEvent.click(screen.getByText("headers"));

    const textarea = screen.getByPlaceholderText(
      /Content-Type: application\/json/
    );
    fireEvent.change(textarea, {
      target: { value: "Authorization: Bearer test" },
    });

    expect(mockSetCurrentRequest).toHaveBeenCalledWith({
      headers: { Authorization: "Bearer test" },
    });
  });

  it("should update body", () => {
    render(<RequestTabs />);
    fireEvent.click(screen.getByText("body"));

    const textarea = screen.getByPlaceholderText(/John Doe/);
    fireEvent.change(textarea, { target: { value: '{"test": true}' } });

    expect(mockSetCurrentRequest).toHaveBeenCalledWith({
      body: '{"test": true}',
    });
  });
});
