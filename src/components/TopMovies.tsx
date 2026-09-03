import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import {
  Star,
  TrendingUp,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getMovieStats, TopMovie } from "../services/movieApi";

const SkeletonCard: React.FC = () => (
  <div className="bg-[#121212] rounded-xl border border-zinc-800/90 overflow-hidden animate-pulse w-40 sm:w-56">
    <div className="aspect-2/3 w-full bg-zinc-800" />
    <div className="p-3 space-y-2">
      <div className="h-3.5 bg-zinc-800 rounded w-3/4 mx-auto" />
      <div className="h-3 bg-zinc-800 rounded w-1/3 mx-auto" />
      <div className="h-2.5 bg-zinc-800 rounded w-1/2 mx-auto" />
    </div>
  </div>
);

const AUTO_ADVANCE_INTERVAL = 4000;
const DRAG_THRESHOLD = 80;
const DRAG_VELOCITY_THRESHOLD = 400;

export const TopMovies: React.FC = () => {
  const [movies, setMovies] = useState<TopMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMovieStats();
        setMovies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const count = movies.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Auto-advance, paused on hover or drag
  useEffect(() => {
    if (isPaused || count <= 1) return;
    const timer = setInterval(goNext, AUTO_ADVANCE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, count, goNext]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsPaused(false);
    const { offset, velocity } = info;
    if (offset.x < -DRAG_THRESHOLD || velocity.x < -DRAG_VELOCITY_THRESHOLD) {
      goNext();
    } else if (
      offset.x > DRAG_THRESHOLD ||
      velocity.x > DRAG_VELOCITY_THRESHOLD
    ) {
      goPrev();
    }
  };

  const handleCardClick = (index: number, movieId: string) => {
    if (index === activeIndex) {
      navigate(`/movies/${movieId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      goTo(index);
    }
  };

  // Relative offset of a card from the active index, wrapped to the shortest direction
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  const cardWidth = isMobile ? 150 : 240;
  const spacing = isMobile ? 100 : 190;
  const stageHeight = isMobile ? 300 : 420;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-6">
        <TrendingUp className="w-5 h-5 text-[#E50914]" />
        Top Rated Movies
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error || movies.length === 0 ? (
        <p className="text-center text-sm text-zinc-500 py-6">
          No rated movies yet.
        </p>
      ) : (
        <div
          className="relative w-full flex items-center justify-center select-none"
          style={{ height: stageHeight }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={goPrev}
            aria-label="Previous movie"
            className="absolute left-0 sm:left-4 z-20 p-2 rounded-full bg-[#121212]/80 border border-zinc-700 text-white hover:border-[#E50914] hover:text-[#E50914] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <motion.div
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence initial={false}>
              {movies.map((movie, index) => {
                const offset = getOffset(index);
                if (Math.abs(offset) > 2) return null;

                const isActive = offset === 0;

                return (
                  <motion.div
                    key={movie._id}
                    className="absolute top-1/2 left-1/2 pointer-events-auto"
                    style={{ width: cardWidth }}
                    initial={false}
                    animate={{
                      x: `calc(-50% + ${offset * spacing}px)`,
                      y: "-50%",
                      scale: isActive ? 1 : 1 - Math.abs(offset) * 0.18,
                      opacity: Math.abs(offset) === 2 ? 0.35 : 1,
                      zIndex: 10 - Math.abs(offset),
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    onClick={() => handleCardClick(index, movie._id)}
                  >
                    <div
                      className={`group bg-[#121212] rounded-xl border overflow-hidden cursor-pointer transition-colors duration-300 ${
                        isActive
                          ? "border-[#E50914]/60 shadow-[0_8px_35px_rgba(229,9,20,0.25)]"
                          : "border-zinc-800/90"
                      }`}
                    >
                      <div className="aspect-2/3 w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {movie.poster?.url ? (
                          <img
                            src={movie.poster.url}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            draggable={false}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Film className="w-10 h-10 text-zinc-700" />
                        )}
                      </div>
                      {isActive && (
                        <div className="p-3 text-center">
                          <p className="text-sm font-bold text-white line-clamp-1">
                            {movie.title}
                          </p>
                          <div className="flex items-center justify-center gap-1 text-[#E50914] mt-1">
                            <Star className="w-3.5 h-3.5 fill-[#E50914]" />
                            <span className="text-sm font-bold">
                              {movie.averageRating}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500">
                            {movie.reviewCount} review
                            {movie.reviewCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <button
            onClick={goNext}
            aria-label="Next movie"
            className="absolute right-0 sm:right-4 z-20 p-2 rounded-full bg-[#121212]/80 border border-zinc-700 text-white hover:border-[#E50914] hover:text-[#E50914] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
