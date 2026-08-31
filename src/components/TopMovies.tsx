import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Star, TrendingUp, Film } from "lucide-react";
import { getMovieStats, TopMovie } from "../services/movieApi";

const SkeletonCard: React.FC = () => (
  <div className="bg-[#121212] rounded-xl border border-zinc-800/90 overflow-hidden animate-pulse">
    <div className="aspect-2/3 w-full bg-zinc-800" />
    <div className="p-3 space-y-2">
      <div className="h-3.5 bg-zinc-800 rounded w-3/4 mx-auto" />
      <div className="h-3 bg-zinc-800 rounded w-1/3 mx-auto" />
      <div className="h-2.5 bg-zinc-800 rounded w-1/2 mx-auto" />
    </div>
  </div>
);

export const TopMovies: React.FC = () => {
  const [movies, setMovies] = useState<TopMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleSelectMovie = (movieId: string) => {
    navigate(`/movies/${movieId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  } as const;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-6">
        <TrendingUp className="w-5 h-5 text-[#E50914]" />
        Top Rated Movies
      </h2>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        ) : error || movies.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-zinc-500 py-6"
          >
            No rated movies yet.
          </motion.p>
        ) : (
          <motion.div
            key="movies"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {movies.map((movie) => (
              <motion.div
                key={movie._id}
                variants={itemVariants}
                onClick={() => handleSelectMovie(movie._id)}
                className="group bg-[#121212] rounded-xl border border-zinc-800/90 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#E50914]/40 hover:shadow-[0_8px_25px_rgba(229,9,20,0.12)]"
              >
                <div className="aspect-2/3 w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                  {movie.poster?.url ? (
                    <img
                      src={movie.poster.url}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <Film className="w-10 h-10 text-zinc-700 group-hover:text-[#E50914] transition-colors" />
                  )}
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
