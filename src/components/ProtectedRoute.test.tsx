import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { renderWithProviders } from "../test/renderWithProviders";
import { mockAuth } from "../test/mocks";
import { buildUser } from "../test/factories";

jest.mock("../context/AuthContext");

const renderAt = (route: string) =>
  renderWithProviders(
    <Routes>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <p>Profile page</p>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <p>Admin area</p>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<p>Login page</p>} />
      <Route path="/movies" element={<p>Movies page</p>} />
    </Routes>,
    { route },
  );

describe("ProtectedRoute", () => {
  it("shows a loading message while the session is being checked", () => {
    mockAuth({ isLoading: true });

    renderAt("/profile");

    expect(screen.getByText("Checking session...")).toBeInTheDocument();
    expect(screen.queryByText("Profile page")).not.toBeInTheDocument();
  });

  it("redirects to /login when nobody is logged in", async () => {
    mockAuth({ user: null });

    renderAt("/profile");

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Profile page")).not.toBeInTheDocument();
  });

  it("renders its children for a logged-in user", async () => {
    mockAuth({ user: buildUser() });

    renderAt("/profile");

    expect(await screen.findByText("Profile page")).toBeInTheDocument();
  });

  it("redirects a non-admin away from an admin-only route", async () => {
    mockAuth({ user: buildUser({ role: "user" }) });

    renderAt("/admin");

    expect(await screen.findByText("Movies page")).toBeInTheDocument();
    expect(screen.queryByText("Admin area")).not.toBeInTheDocument();
  });

  it("lets an admin into an admin-only route", async () => {
    mockAuth({ user: buildUser({ role: "admin" }) });

    renderAt("/admin");

    expect(await screen.findByText("Admin area")).toBeInTheDocument();
  });
});
