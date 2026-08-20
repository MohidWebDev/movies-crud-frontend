import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  User,
  Film,
  Star,
  Clock,
} from "lucide-react";
import { Movie } from "../types";

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  onBack,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  const parsedGenres =
    movie.genres && movie.genres.length > 0
      ? movie.genres
      : movie.genre
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);

  return (
    <div
      id="movie-details-section"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
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

      {/* Main Details Card matching Mockup 3 */}
      <div className="flex flex-col items-center text-center">
        {/* Poster with ambient glow effect frame */}
        <div className="relative w-full max-w-md aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl mb-8 group">
          {/* Ambient red glow behind poster */}
          <div className="absolute -inset-4 bg-gradient-to-t from-red-600/30 via-red-900/10 to-transparent blur-2xl -z-10" />

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

          {/* Rating tag in poster overlay */}
          {movie.rating && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#E50914] text-white text-sm font-black shadow-xl flex items-center gap-1.5 backdrop-blur-sm">
              <Star className="w-4 h-4 fill-white text-white" />
              <span>{movie.rating.toFixed(1)} / 10</span>
            </div>
          )}
        </div>

        {/* Movie Title */}
        <h1
          id="details-movie-title"
          className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display mb-3"
        >
          {movie.title}
        </h1>

        {/* Metadata subline: Year • Director */}
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
          {movie.duration && (
            <>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Clock className="w-4 h-4 text-[#E50914]" />
                {movie.duration}
              </span>
            </>
          )}
        </div>

        {/* Genre Tags */}
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

        {/* Action Buttons: "Edit Details" and "Delete" */}
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
      </div>
    </div>
  );
};
