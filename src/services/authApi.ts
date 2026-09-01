import { User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const AUTH_URL = `${API_BASE_URL}/api/auth`;

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

// Handles non-2xx responses consistently, matching movieApi's pattern
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Something went wrong");
  }
  return res.json();
};

export const register = async (
  payload: RegisterPayload,
): Promise<Omit<User, "id"> & { id: string }> => {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // needed to receive the httpOnly refresh token cookie
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const refresh = async (): Promise<{ accessToken: string }> => {
  const res = await fetch(`${AUTH_URL}/refresh`, {
    method: "POST",
    credentials: "include", // sends the httpOnly refresh token cookie
  });
  return handleResponse(res);
};

export const logout = async (): Promise<void> => {
  const res = await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to logout");
  }
};

export const getMe = async (accessToken: string): Promise<User> => {
  const res = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleResponse(res);
};
