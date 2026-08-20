import React, { useState } from "react";
import { motion } from "motion/react";
import {
  UploadCloud,
  Image as ImageIcon,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";
import { Movie } from "../types";

interface AddMovieFormProps {
  onAddMovie: (movie: Omit<Movie, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export const AddMovieForm: React.FC<AddMovieFormProps> = ({
  onAddMovie,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [rating, setRating] = useState("8.5");
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPosterUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !director.trim()) return;

    const genresList = genre
      .split(",")
      .map((g) => g.trim().toUpperCase())
      .filter(Boolean);

    onAddMovie({
      title: title.trim(),
      director: director.trim(),
      year: year.trim() || "2024",
      genre: genre.trim() || "General",
      genres: genresList.length > 0 ? genresList : ["CINEMA"],
      posterUrl: posterUrl.trim() || undefined,
      rating: parseFloat(rating) || 8.0,
    });
  };

  return (
    <div id="add-movie-section" className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2
            id="add-movie-title"
            className="text-3xl font-extrabold text-white tracking-tight font-display"
          >
            Add New Movie
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Contribute to the ultimate cinematic collection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poster Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Poster Image
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                dragOver
                  ? "border-[#E50914] bg-[#E50914]/10"
                  : "border-zinc-800 bg-[#181818] hover:border-zinc-700"
              }`}
            >
              {posterUrl ? (
                <div className="relative inline-block">
                  <img
                    src={posterUrl}
                    alt="Poster Preview"
                    referrerPolicy="no-referrer"
                    className="h-44 object-cover rounded-lg shadow-md mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setPosterUrl("")}
                    className="absolute -top-2 -right-2 p-1.5 bg-[#E50914] text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300">
                    <UploadCloud className="w-6 h-6 text-[#E50914]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Upload Poster
                  </span>
                  <span className="text-xs text-zinc-500">
                    Drag and drop, or click to browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        handleFileUpload(e.target.files[0]);
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Fields matching mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Movie Title *
              </label>
              <input
                id="input-movie-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blade Runner 2049"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Director Name *
              </label>
              <input
                id="input-director"
                type="text"
                required
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="e.g. Denis Villeneuve"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Release Year
              </label>
              <input
                id="input-year"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Primary Genre
              </label>
              <input
                id="input-genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Drama, Sci-Fi"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <motion.button
            id="submit-add-movie-btn"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all cursor-pointer"
          >
            Add Movie
          </motion.button>
        </form>
      </div>
    </div>
  );
};
