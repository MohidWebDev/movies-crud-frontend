import { render, screen } from "@testing-library/react";
import { StarRating } from "../components/StarRating";
import { apiClient } from "../services/apiClient";

describe("frontend test setup", () => {
  it("renders a React component in jsdom", () => {
    render(<StarRating value={3} />);

    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("reads VITE_API_BASE_URL through the import.meta.env transform", () => {
    expect(apiClient.defaults.baseURL).toBe("http://localhost:3000");
  });
});
