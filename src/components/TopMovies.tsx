import React, { useState, useEffect } from "react";
import { Star, TrendingUp, Film } from "lucide-react";
import { getMovieStats, TopMovie } from "../services/movieApi";

export const TopMovies: React.FC = () => {
  const [movies, setMovies] = useState<TopMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading || error || movies.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-6">
        <TrendingUp className="w-5 h-5 text-[#E50914]" />
        Top Rated Movies
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden"
          >
            <div className="aspect-2/3 w-full bg-zinc-900 flex items-center justify-center">
              {movie.poster?.url ? (
                <img
                  src={movie.poster.url}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Film className="w-10 h-10 text-zinc-700" />
              )}
            </div>
            <div className="p-3 text-center">
              <p className="text-sm font-bold text-white line-clamp-1">
                {movie.title}
              </p>
              <div className="flex items-center justify-center gap-1 text-[#E50914] mt-1">
                <Star className="w-3.5 h-3.5 fill-[#E50914]" />
                <span className="text-sm font-bold">{movie.averageRating}</span>
              </div>
              <p className="text-xs text-zinc-500">
                {movie.reviewCount} review{movie.reviewCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
