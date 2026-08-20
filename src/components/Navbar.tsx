import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/movies", label: "All Movies" },
    { path: "/add", label: "Add Movie" },
  ];

  const isItemActive = (path: string) => {
    if (path === "/movies") {
      return (
        location.pathname === "/movies" ||
        location.pathname.startsWith("/movies/") ||
        location.pathname.startsWith("/edit/")
      );
    }
    return location.pathname === path;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0A0A]/90 border-b border-zinc-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Text */}
        <Link
          id="brand-logo-btn"
          to="/"
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] rounded-lg p-1 cursor-pointer"
        >
          <span className="text-2xl font-black tracking-tight text-white font-display group-hover:text-[#E50914] transition-colors duration-200">
            Movies App
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = isItemActive(item.path);

            return (
              <Link
                key={item.path}
                id={`nav-link-${item.path.replace("/", "") || "home"}`}
                to={item.path}
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none cursor-pointer ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    id="active-nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E50914] rounded-full shadow-[0_0_10px_rgba(229,9,20,0.8)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6 text-[#E50914]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-zinc-800 bg-[#0F0F0F]/98 px-4 py-4 space-y-2 backdrop-blur-lg"
          >
            {navItems.map((item) => {
              const isActive = isItemActive(item.path);

              return (
                <button
                  key={item.path}
                  id={`mobile-nav-${item.path.replace("/", "") || "home"}`}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
