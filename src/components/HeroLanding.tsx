import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { TopMovies } from "./TopMovies";

interface HeroLandingProps {
  onViewMovies: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onViewMovies }) => {
  return (
    <div
      id="hero-landing-page"
      className="relative flex-1 w-full h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-red-900/20 via-zinc-950 to-black py-6 sm:py-10"
    >
      {/* Ambient background glowing circles and grid lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-112.5 h-70 bg-red-600/20 blur-[110px] rounded-full pointer-events-none"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[36px_36px]" />
      </div>

      {/* Hero Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center my-auto"
      >
        {/* Subtle decorative pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-red-900/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 shadow-inner shadow-red-950/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
          <span>Curated Film Vault</span>
        </motion.div>

        {/* Hero Title with floating ambient light pulse */}
        <div className="relative mb-2 sm:mb-3">
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-[#E50914]/25 blur-2xl rounded-3xl -z-10"
          />
          <h1
            id="hero-title"
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-display drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          >
            Movies App
          </h1>
        </div>

        {/* Tagline */}
        <p
          id="hero-tagline"
          className="text-base sm:text-xl text-zinc-300 font-normal tracking-wide max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed"
        >
          Your Personal Cinema Archive
        </p>

        {/* Centered CTA Button */}
        <div className="flex items-center justify-center w-full">
          <motion.button
            id="hero-view-movies-btn"
            onClick={onViewMovies}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#E50914] text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(229,9,20,0.55)] hover:shadow-[0_0_35px_rgba(229,9,20,0.75)] hover:bg-[#F40612] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/40 cursor-pointer"
          >
            <span>View Movies</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-10">
        <TopMovies />
      </div>
    </div>
  );
};
