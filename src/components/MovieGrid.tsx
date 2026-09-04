import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Film, Edit3, Trash2, Plus, X } from "lucide-react";
import { Movie } from "../types";
import { getAllMovies } from "../services/movieApi";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { useAuth } from "../context/AuthContext";

interface MovieGridProps {
  onSelectMovie: (movie: Movie) => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
  onAddMovie: () => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  onSelectMovie,
  onEditMovie,
  onDeleteMovie,
  onAddMovie,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const [sortByYear, setSortByYear] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Mirrors this grid's Tailwind breakpoints: 2/3/4/5/6 columns
  const getColumnsForWidth = (width: number) => {
    if (width >= 1280) return 6;
    if (width >= 1024) return 5;
    if (width >= 768) return 4;
    if (width >= 640) return 3;
    return 2;
  };

  const [pageLimit, setPageLimit] = useState(
    () => getColumnsForWidth(window.innerWidth) * 5,
  );

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getAllMovies({
          page,
          limit: pageLimit,
          genre: selectedGenre === "ALL" ? undefined : selectedGenre,
          sort: sortByYear ? "year" : undefined,
          search: debouncedSearchQuery || undefined,
        });
        setMovies(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movies");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [page, pageLimit, selectedGenre, sortByYear, debouncedSearchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getColumnsForWidth(window.innerWidth) * 5;
      setPageLimit((prev) => (prev !== newLimit ? newLimit : prev));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [pageLimit]);

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleToggleSort = () => {
    setSortByYear((prev) => !prev);
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const handleNextPage = () => {
    setPage((p) => Math.min(p + 1, totalPages));
  };

  // Fixed genre list — must match the backend's enum (models/movieModel.js)
  const GENRES = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Historical",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sports",
    "Thriller",
    "War",
    "Western",
  ];
  const allGenres = ["ALL", ...GENRES];

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
  } as const;

  return (
    <div
      id="movie-grid-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-w-0"
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
            onClick={handleToggleSort}
            className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer border ${
              sortByYear
                ? "border-transparent bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.5)]"
                : "border-zinc-800 bg-[#181818] text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            Sort by Year
          </button>

          {user && (
            <button
              id="grid-add-new-btn"
              onClick={onAddMovie}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white text-sm font-semibold shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all hover:scale-102 active:scale-98 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Movie</span>
            </button>
          )}
        </div>
      </div>

      {/* Genre Filter Dropdown */}
      <div className="py-4 max-w-48">
        <SingleSelectDropdown
          label="Filter by Genre"
          options={allGenres}
          selected={selectedGenre}
          onChange={handleGenreSelect}
        />
      </div>

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
      ) : movies.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-4"
        >
          {movies.map((movie) => {
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
                className="group relative flex flex-col min-w-0 bg-[#121212] rounded-2xl border border-zinc-800/90 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#E50914]/40 hover:shadow-[0_8px_25px_rgba(229,9,20,0.12)]"
              >
                {/* Poster Area with rating badge */}
                <div className="relative aspect-4/5 w-full min-w-0 bg-zinc-900 overflow-hidden flex items-center justify-center">
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
                  <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />
                </div>

                {/* Card Content Information */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-[#121212]">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-red-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {movie.director} • {movie.year}
                    </p>

                    {/* Genre Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {parsedGenres.map((genre, idx) => (
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
                  {isAdmin && (
                    <div
                      className="pt-2 border-t border-zinc-800/80 flex items-center gap-2"
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
                  )}
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

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-[#181818] border border-zinc-800 text-sm text-zinc-300 hover:bg-[#232323] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-[#181818] border border-zinc-800 text-sm text-zinc-300 hover:bg-[#232323] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
