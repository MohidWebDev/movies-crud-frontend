import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-zinc-400">
        <div className="w-10 h-10 border-2 border-zinc-700 border-t-[#E50914] rounded-full animate-spin mb-4" />
        <p className="text-sm">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/movies" replace />;
  }

  return <>{children}</>;
};
