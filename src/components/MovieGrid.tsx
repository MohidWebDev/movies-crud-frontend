import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Search, Film, Plus, X } from "lucide-react";
import { Movie } from "../types";
import { getAllMovies } from "../services/movieApi";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { MovieCard } from "./MovieCard";
import { useAuth } from "../context/AuthContext";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";

interface MovieGridProps {
  onSelectMovie: (movie: Movie) => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
  onAddMovie: () => void;
}

// Mirrors this grid's Tailwind breakpoints: 2/3/4/5/6 columns
const getColumnsForWidth = (width: number) => {
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
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
const ALL_GENRES = ["ALL", ...GENRES];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const MovieGrid: React.FC<MovieGridProps> = ({
  onSelectMovie,
  onEditMovie,
  onDeleteMovie,
  onAddMovie,
}) => {
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("ALL");
  const [sortByYear, setSortByYear] = useState(false);

  const [pageLimit, setPageLimit] = useState(
    () => getColumnsForWidth(window.innerWidth) * 5,
  );

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const params = {
    page,
    limit: pageLimit,
    genre: selectedGenre === "ALL" ? undefined : selectedGenre,
    sort: sortByYear ? ("year" as const) : undefined,
    search: debouncedSearchQuery || undefined,
  };

  const { data, isLoading, isPlaceholderData, error } = useQuery({
    queryKey: queryKeys.movies.list(params),
    queryFn: () => getAllMovies(params),
    placeholderData: keepPreviousData,
  });

  const movies = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

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

  // Stable identity, so the memoized dropdown is not re-rendered by keystrokes
  const handleGenreSelect = useCallback((genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  }, []);

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
          options={ALL_GENRES}
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
          <p className="text-sm text-zinc-400">{error.message}</p>
        </div>
      ) : movies.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-4 transition-opacity ${
            isPlaceholderData ? "opacity-60" : ""
          }`}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isAdmin={isAdmin}
              onSelect={onSelectMovie}
              onEdit={onEditMovie}
              onDelete={onDeleteMovie}
            />
          ))}
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
