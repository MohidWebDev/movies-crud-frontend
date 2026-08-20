import React from "react";

interface FooterProps {
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateHome }) => {
  return (
    <footer
      id="main-footer"
      className="mt-auto border-t border-zinc-900 bg-[#090909] text-zinc-400 py-3 sm:py-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        {/* Brand identity matching Navbar */}
        <div className="flex items-center">
          <button
            id="footer-brand-btn"
            onClick={onNavigateHome}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] rounded-lg p-0.5 cursor-pointer"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display group-hover:text-[#E50914] transition-colors duration-200">
              Movies App
            </span>
          </button>
        </div>

        {/* Copyright notice */}
        <div className="text-xs text-zinc-500 font-medium">
          © 2026 Movies App. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
