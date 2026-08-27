import React, { useState, useEffect } from "react";
import { Star, TrendingUp } from "lucide-react";
import { getMovieStats, GenreStats } from "../services/movieApi";

export const TopGenres: React.FC = () => {
  const [stats, setStats] = useState<GenreStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMovieStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || error || stats.length === 0) {
    return null;
  }

  const topFive = stats.slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-6">
        <TrendingUp className="w-5 h-5 text-[#E50914]" />
        Top Rated Genres
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {topFive.map((stat) => (
          <div
            key={stat.genre}
            className="bg-[#121212] border border-zinc-800 rounded-xl p-4 text-center"
          >
            <p className="text-sm font-bold text-white uppercase tracking-wide mb-2">
              {stat.genre}
            </p>
            <div className="flex items-center justify-center gap-1 text-[#E50914] mb-1">
              <Star className="w-4 h-4 fill-[#E50914]" />
              <span className="font-bold">{stat.averageRating}</span>
            </div>
            <p className="text-xs text-zinc-500">
              {stat.ratedMovieCount} rated movie
              {stat.ratedMovieCount !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
