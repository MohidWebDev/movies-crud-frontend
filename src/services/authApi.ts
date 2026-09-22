import { apiClient } from "./apiClient";
import { User } from "../types";

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

export const register = async (
  payload: RegisterPayload,
): Promise<Omit<User, "id"> & { id: string }> => {
  const { data } = await apiClient.post("/api/auth/register", payload);
  return data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/api/auth/login", payload);
  return data;
};

export const refresh = async (): Promise<{ accessToken: string }> => {
  const { data } = await apiClient.post("/api/auth/refresh");
  return data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get("/api/auth/me");
  return data;
};
