import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/movies");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Create Account
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Join to start building your movie archive.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mohid Yaseen"
              className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full py-3.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </motion.button>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#E50914] hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
