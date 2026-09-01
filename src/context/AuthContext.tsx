import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import * as authApi from "../services/authApi";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try to silently restore the session using the
  // httpOnly refresh token cookie (if one exists and is still valid).
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { accessToken: newToken } = await authApi.refresh();
        const currentUser = await authApi.getMe(newToken);
        setAccessToken(newToken);
        setUser(currentUser);
      } catch {
        // No valid refresh token — user is simply not logged in, not an error
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { accessToken: newToken, user: loggedInUser } = await authApi.login({
      email,
      password,
    });
    setAccessToken(newToken);
    setUser(loggedInUser);
  };

  const register = async (name: string, email: string, password: string) => {
    await authApi.register({ name, email, password });
    // Registration doesn't log the user in automatically — reuse login logic
    await login(email, password);
  };

  const logout = async () => {
    await authApi.logout();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
