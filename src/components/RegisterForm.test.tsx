import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { RegisterForm } from "./RegisterForm";
import { renderWithProviders } from "../test/renderWithProviders";
import { mockAuth } from "../test/mocks";

jest.mock("../context/AuthContext");

const renderRegister = () =>
  renderWithProviders(
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/movies" element={<p>Movies page</p>} />
      <Route path="/login" element={<p>Login page</p>} />
    </Routes>,
    { route: "/register" },
  );

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  name = "Jane Doe",
  email = "jane@example.com",
  password = "secret123",
) => {
  await user.type(screen.getByPlaceholderText("e.g. Mohid Yaseen"), name);
  await user.type(screen.getByPlaceholderText("you@example.com"), email);
  await user.type(screen.getByPlaceholderText("••••••••"), password);
};

describe("RegisterForm", () => {
  it("renders the form fields, submit button and login link", () => {
    mockAuth();
    renderRegister();

    expect(
      screen.getByRole("heading", { name: "Create Account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. Mohid Yaseen"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Log In" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("declares the required fields and the minimum password length", () => {
    mockAuth();
    renderRegister();

    expect(screen.getByPlaceholderText("e.g. Mohid Yaseen")).toBeRequired();
    expect(screen.getByPlaceholderText("you@example.com")).toBeRequired();
    const password = screen.getByPlaceholderText("••••••••");
    expect(password).toBeRequired();
    expect(password).toHaveAttribute("minLength", "6");
  });

  it("calls register with name, email and password, then goes to /movies", async () => {
    const user = userEvent.setup();
    const { register } = mockAuth();
    renderRegister();

    await fillForm(user, "Jane Doe", "jane@example.com", "secret123");
    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith(
      "Jane Doe",
      "jane@example.com",
      "secret123",
    );
    expect(await screen.findByText("Movies page")).toBeInTheDocument();
  });

  it("disables the button and shows progress while registering", async () => {
    const user = userEvent.setup();
    let finishRegister!: () => void;
    const register = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finishRegister = resolve;
        }),
    );
    mockAuth({ register });
    renderRegister();

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Register" }));

    const pendingButton = await screen.findByRole("button", {
      name: "Creating account...",
    });
    expect(pendingButton).toBeDisabled();

    finishRegister();
    expect(await screen.findByText("Movies page")).toBeInTheDocument();
  });

  it("shows the error message when registration fails and stays on the page", async () => {
    const user = userEvent.setup();
    mockAuth({
      register: jest.fn().mockRejectedValue(new Error("Email already in use")),
    });
    renderRegister();

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Email already in use")).toBeInTheDocument();
    expect(screen.queryByText("Movies page")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeEnabled();
  });

  it("falls back to a generic message when the error is not an Error", async () => {
    const user = userEvent.setup();
    mockAuth({ register: jest.fn().mockRejectedValue("nope") });
    renderRegister();

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Registration failed")).toBeInTheDocument();
  });

  it("does not submit when the required fields are empty", async () => {
    const user = userEvent.setup();
    const { register } = mockAuth();
    renderRegister();

    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(register).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Create Account" }),
    ).toBeInTheDocument();
  });
});
