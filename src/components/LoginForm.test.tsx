import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { renderWithProviders } from "../test/renderWithProviders";
import { mockAuth } from "../test/mocks";

jest.mock("../context/AuthContext");

const renderLogin = () =>
  renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/movies" element={<p>Movies page</p>} />
      <Route path="/register" element={<p>Register page</p>} />
    </Routes>,
    { route: "/login" },
  );

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  email = "jane@example.com",
  password = "secret123",
) => {
  await user.type(screen.getByPlaceholderText("you@example.com"), email);
  await user.type(screen.getByPlaceholderText("••••••••"), password);
};

describe("LoginForm", () => {
  it("renders the form fields, submit button and register link", () => {
    mockAuth();
    renderLogin();

    expect(
      screen.getByRole("heading", { name: "Welcome Back" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("calls login with the typed credentials and goes to /movies", async () => {
    const user = userEvent.setup();
    const { login } = mockAuth();
    renderLogin();

    await fillForm(user, "jane@example.com", "secret123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith("jane@example.com", "secret123");
    expect(await screen.findByText("Movies page")).toBeInTheDocument();
  });

  it("disables the button and shows progress while logging in", async () => {
    const user = userEvent.setup();
    let finishLogin!: () => void;
    const login = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finishLogin = resolve;
        }),
    );
    mockAuth({ login });
    renderLogin();

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Log In" }));

    const pendingButton = await screen.findByRole("button", {
      name: "Logging in...",
    });
    expect(pendingButton).toBeDisabled();

    finishLogin();
    expect(await screen.findByText("Movies page")).toBeInTheDocument();
  });

  it("shows the error message when login fails and stays on the page", async () => {
    const user = userEvent.setup();
    mockAuth({
      login: jest
        .fn()
        .mockRejectedValue(new Error("Invalid email or password")),
    });
    renderLogin();

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(
      await screen.findByText("Invalid email or password"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Movies page")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeEnabled();
  });

  it("falls back to a generic message when the error is not an Error", async () => {
    const user = userEvent.setup();
    mockAuth({ login: jest.fn().mockRejectedValue("nope") });
    renderLogin();

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(await screen.findByText("Login failed")).toBeInTheDocument();
  });

  it("does not submit when the required fields are empty", async () => {
    const user = userEvent.setup();
    const { login } = mockAuth();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(login).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Welcome Back" }),
    ).toBeInTheDocument();
  });
});
