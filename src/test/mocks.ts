import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

type AuthValue = ReturnType<typeof useAuth>;

// Requires jest.mock("../context/AuthContext") in the test file
export const mockAuth = (overrides: Partial<AuthValue> = {}): AuthValue => {
  const value: AuthValue = {
    user: null,
    accessToken: null,
    isLoading: false,
    login: jest.fn().mockResolvedValue(undefined),
    register: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  jest.mocked(useAuth).mockReturnValue(value);
  return value;
};

// Requires jest.mock("../context/ToastContext") in the test file
export const mockToast = () => {
  const showToast = jest.fn();
  jest.mocked(useToast).mockReturnValue({ showToast });
  return { showToast };
};
