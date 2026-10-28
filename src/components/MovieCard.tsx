import React, { useState } from "react";
import { motion } from "motion/react";
import { Film, Edit3, Trash2 } from "lucide-react";
import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
  isAdmin: boolean;
  onSelect: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

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

export const MovieCard = React.memo(function MovieCard({
  movie,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
}: MovieCardProps) {
  // Remember which poster URL failed, so a replaced poster is tried again
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const hasValidImage = movie.posterUrl && failedUrl !== movie.posterUrl;
  const parsedGenres = movie.genre
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  return (
    <motion.div
      variants={itemVariants}
      id={`movie-card-${movie.id}`}
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col min-w-0 bg-[#121212] rounded-2xl border border-zinc-800/90 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#E50914]/40 hover:shadow-[0_8px_25px_rgba(229,9,20,0.12)]"
    >
      {/* Poster Area with rating badge */}
      <div className="relative aspect-4/5 w-full min-w-0 bg-zinc-900 overflow-hidden flex items-center justify-center">
        {hasValidImage ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onError={() => setFailedUrl(movie.posterUrl ?? null)}
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
              onClick={() => onEdit(movie)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-zinc-300" />
              <span>Edit</span>
            </button>

            <button
              id={`delete-btn-${movie.id}`}
              onClick={() => onDelete(movie)}
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
});
