import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Edit3, Trash2, Calendar, User, Film } from "lucide-react";
import { Movie } from "../types";
import { getMovieById } from "../services/movieApi";
import { Review } from "../types";
import { getReviewsForMovie } from "../services/reviewApi";
import { AddReviewForm } from "./AddReviewForm";
import { ReviewList } from "./ReviewList";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface MovieDetailsProps {
  movieId: string;
  onBack: () => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movieId,
  onBack,
  onEdit,
  onDelete,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMovieById(movieId);
        setMovie(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load movie details",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const data = await getReviewsForMovie(movieId);
        setReviews(data);
      } catch (err) {
        setReviewsError(
          err instanceof Error ? err.message : "Failed to load reviews",
        );
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [movieId]);

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-zinc-400">
        <div className="w-10 h-10 border-2 border-zinc-700 border-t-[#E50914] rounded-full animate-spin mb-4" />
        <p className="text-sm">Loading movie...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-red-400 font-semibold mb-1">Failed to load movie</p>
        <p className="text-sm text-zinc-400 mb-6">{error}</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white text-sm font-semibold hover:bg-[#F40612] transition-all cursor-pointer"
        >
          Back to All Movies
        </button>
      </div>
    );
  }

  const parsedGenres = movie.genre
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  return (
    <div
      id="movie-details-section"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Back button */}
      <button
        id="back-to-movies-btn"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Movies</span>
      </button>

      {/* Main Details Card */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-full max-w-md aspect-3/4 sm:aspect-4/5 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl mb-8 group">
          <div className="absolute -inset-4 bg-linear-to-t from-red-600/30 via-red-900/10 to-transparent blur-2xl -z-10" />

          {movie.posterUrl && !imageError ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-zinc-600">
              <Film className="w-24 h-24 text-[#E50914] stroke-[1.2] mb-4" />
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                {movie.title}
              </span>
            </div>
          )}
        </div>

        <h1
          id="details-movie-title"
          className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display mb-3"
        >
          {movie.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-400 text-sm sm:text-base font-medium mb-4">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Calendar className="w-4 h-4 text-[#E50914]" />
            {movie.year}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <User className="w-4 h-4 text-[#E50914]" />
            {movie.director}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {parsedGenres.map((g, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#1A1A1A] text-red-400 border border-red-950/60 shadow-sm"
            >
              {g}
            </span>
          ))}
        </div>

        {isAdmin && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <motion.button
              id="details-edit-btn"
              onClick={() => onEdit(movie)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(229,9,20,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </motion.button>

            <motion.button
              id="details-delete-btn"
              onClick={() => onDelete(movie)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#1E1E1E] hover:bg-[#281517] hover:text-red-400 text-zinc-300 font-bold text-sm tracking-wide border border-zinc-800 hover:border-red-900/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </motion.button>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto mt-4 space-y-6">
        {user ? (
          <AddReviewForm movieId={movieId} onReviewAdded={handleReviewAdded} />
        ) : (
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-sm text-zinc-400">
              Please{" "}
              <Link to="/login" className="text-[#E50914] hover:underline">
                log in
              </Link>{" "}
              to write a review.
            </p>
          </div>
        )}
        <ReviewList
          reviews={reviews}
          isLoading={reviewsLoading}
          error={reviewsError}
        />
      </div>
    </div>
  );
};
