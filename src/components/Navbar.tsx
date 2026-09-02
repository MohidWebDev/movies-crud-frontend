import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/movies", label: "All Movies" },
    ...(user ? [{ path: "/add", label: "Add Movie" }] : []),
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

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeItem = navItems.find((item) => isItemActive(item.path));
    if (!activeItem || !navRef.current) return;

    const el = itemRefs.current[activeItem.path];
    if (!el) return;

    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();

    setUnderlineStyle({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
    });
  }, [location.pathname, user]);

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0A0A]/90 border-b border-zinc-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-[1fr_auto_1fr] items-center">
        <Link
          id="brand-logo-btn"
          to="/"
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] rounded-lg p-1 cursor-pointer"
        >
          <span className="text-2xl font-black tracking-tight text-white font-display group-hover:text-[#E50914] transition-colors duration-200">
            Movies App
          </span>
        </Link>

        <nav
          id="desktop-nav"
          ref={navRef}
          className="hidden md:flex items-center gap-8 relative justify-self-center"
        >
          {navItems.map((item) => {
            const isActive = isItemActive(item.path);

            return (
              <Link
                key={item.path}
                id={`nav-link-${item.path.replace("/", "") || "home"}`}
                to={item.path}
                ref={(el) => {
                  itemRefs.current[item.path] = el;
                }}
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none cursor-pointer ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}

          <motion.div
            id="active-nav-indicator"
            animate={{ left: underlineStyle.left, width: underlineStyle.width }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute -bottom-1 h-0.5 bg-[#E50914] rounded-full shadow-[0_0_10px_rgba(229,9,20,0.8)]"
          />
        </nav>

        <div className="hidden md:flex items-center gap-4 justify-self-end">
          {isLoading ? null : user ? (
            <>
              <span className="text-sm text-zinc-400">
                Hi,{" "}
                <span className="text-white font-semibold">{user.name}</span>
                {user.role === "admin" && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E50914]/15 text-[#E50914] text-xs font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-sm font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white text-sm font-bold transition-all cursor-pointer"
              >
                Register
              </Link>
            </>
          )}
        </div>

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

            {isLoading ? null : user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout ({user.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick("/login")}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30 cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
