import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Film, Edit3, Trash2, Plus, X, Filter } from "lucide-react";
import { Movie } from "../types";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  error?: string | null;
  onSelectMovie: (movie: Movie) => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
  onAddMovie: () => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  error = null,
  onSelectMovie,
  onEditMovie,
  onDeleteMovie,
  onAddMovie,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Extract all distinct genres across the movie collection
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach((m) => {
      m.genre
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .forEach((g) => genreSet.add(g));
    });
    return ["ALL", ...Array.from(genreSet)];
  }, [movies]);

  // Filter movies dynamically based on search query and selected genre
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        movie.title.toLowerCase().includes(q) ||
        movie.director.toLowerCase().includes(q) ||
        movie.genre.toLowerCase().includes(q) ||
        movie.year.toString().includes(q);

      if (!matchesSearch) return false;

      if (selectedGenre === "ALL") return true;

      const movieGenres = movie.genre
        .split(",")
        .map((s) => s.trim().toUpperCase());

      return movieGenres.includes(selectedGenre);
    });
  }, [movies, searchQuery, selectedGenre]);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
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
  };

  return (
    <div
      id="movie-grid-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
        {/* Title with red underline accent */}
        <div>
          <h2
            id="collection-heading"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display relative inline-block"
          >
            All Movies
            <span className="block h-1 w-16 bg-[#E50914] mt-2 rounded-full shadow-[0_0_10px_rgba(229,9,20,0.6)]" />
          </h2>
        </div>

        {/* Search Bar matching mockup */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="movie-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141414] border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="grid-add-new-btn"
            onClick={onAddMovie}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white text-sm font-semibold shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all hover:scale-102 active:scale-98 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Movie</span>
          </button>
        </div>
      </div>

      {/* Genre Filter Pills */}
      {allGenres.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 pr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none select-none border ${
                selectedGenre === genre
                  ? "border-transparent bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.5)]"
                  : "border-zinc-800 bg-[#181818] text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Movie Cards 4-Column Grid */}
      {isLoading ? (
        <div className="my-16 flex flex-col items-center justify-center text-zinc-400">
          <div className="w-10 h-10 border-2 border-zinc-700 border-t-[#E50914] rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading movies...</p>
        </div>
      ) : error ? (
        <div className="my-16 p-8 text-center rounded-2xl bg-[#121212] border border-red-900/40 max-w-lg mx-auto">
          <p className="text-red-400 font-semibold mb-1">
            Failed to load movies
          </p>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      ) : filteredMovies.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
        >
          {filteredMovies.map((movie) => {
            const hasValidImage = movie.posterUrl && !imageErrors[movie.id];
            const parsedGenres = movie.genre
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean);

            return (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                id={`movie-card-${movie.id}`}
                onClick={() => onSelectMovie(movie)}
                className="group relative flex flex-col bg-[#121212] rounded-2xl border border-zinc-800/90 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#E50914]/40 hover:shadow-[0_8px_25px_rgba(229,9,20,0.12)]"
              >
                {/* Poster Area with rating badge */}
                <div className="relative aspect-[3/4] w-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                  {hasValidImage ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(movie.id)}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      <Film className="w-16 h-16 stroke-[1.2] mb-2 text-zinc-600 group-hover:text-[#E50914] transition-colors" />
                      <span className="text-xs uppercase tracking-widest font-semibold text-zinc-500">
                        {movie.title}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay for poster readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />
                </div>

                {/* Card Content Information */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#121212]">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-red-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mt-1">
                      {movie.director} • {movie.year}
                    </p>

                    {/* Genre Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {parsedGenres.slice(0, 2).map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#1c1c1c] text-zinc-300 border border-zinc-800"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Edit and Red Delete Button */}
                  <div
                    className="pt-3 border-t border-zinc-800/80 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()} // Prevents card navigation when clicking action buttons
                  >
                    <button
                      id={`edit-btn-${movie.id}`}
                      onClick={() => onEditMovie(movie)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Edit</span>
                    </button>

                    <button
                      id={`delete-btn-${movie.id}`}
                      onClick={() => onDeleteMovie(movie)}
                      className="p-2 rounded-lg bg-[#2A1214] hover:bg-[#E50914] text-red-400 hover:text-white border border-red-950 hover:border-[#E50914] transition-all cursor-pointer shadow-sm group/del"
                      title={`Delete ${movie.title}`}
                      aria-label={`Delete ${movie.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 transition-transform group-hover/del:scale-110" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-16 p-12 text-center rounded-2xl bg-[#121212] border border-zinc-800 max-w-lg mx-auto flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
            <Film className="w-8 h-8 text-[#E50914]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">No movies found</h3>
          <p className="text-sm text-zinc-400 mb-6">
            {searchQuery
              ? `No films matched "${searchQuery}". Try a different search keyword.`
              : "Your cinema archive is currently empty. Start by adding your favorite movies!"}
          </p>
          <button
            onClick={searchQuery ? () => setSearchQuery("") : onAddMovie}
            className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white text-sm font-semibold hover:bg-[#F40612] shadow-lg shadow-red-900/30 transition-all cursor-pointer"
          >
            {searchQuery ? "Clear Search" : "Add First Movie"}
          </button>
        </motion.div>
      )}
    </div>
  );
};
