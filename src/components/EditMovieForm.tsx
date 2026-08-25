import React, { useState } from "react";
import { ArrowLeft, Film, UploadCloud } from "lucide-react";
import { Movie } from "../types";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Romance",
  "Documentary",
  "Thriller",
  "Animation",
];

interface EditMovieFormProps {
  movie: Movie;
  onUpdateMovie: (
    id: string,
    updated: { title: string; director: string; year: number; genre: string },
    posterFile: File | null,
  ) => Promise<void>;
  onCancel: () => void;
}

export const EditMovieForm: React.FC<EditMovieFormProps> = ({
  movie,
  onUpdateMovie,
  onCancel,
}) => {
  const [title, setTitle] = useState(movie.title);
  const [director, setDirector] = useState(movie.director);
  const [year, setYear] = useState(movie.year.toString());
  const [genre, setGenre] = useState(movie.genre);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState(movie.posterUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPosterPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !director.trim() || !year.trim() || !genre.trim())
      return;

    setIsSubmitting(true);
    try {
      await onUpdateMovie(
        movie.id,
        {
          title: title.trim(),
          director: director.trim(),
          year: Number(year),
          genre: genre.trim(),
        },
        posterFile,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="edit-movie-section" className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel</span>
      </button>

      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h2
          id="edit-movie-title"
          className="text-3xl font-extrabold text-white tracking-tight font-display mb-8"
        >
          Edit Movie
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Poster Thumbnail & Change */}
            <div className="w-full sm:w-44 shrink-0 flex flex-col items-center">
              <div className="w-full aspect-3/4 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group">
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-zinc-600">
                    <Film className="w-10 h-10 text-zinc-600 mb-2" />
                    <span className="text-[10px] uppercase font-bold text-zinc-500">
                      No Poster
                    </span>
                  </div>
                )}

                <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity">
                  <UploadCloud className="w-6 h-6 text-[#E50914] mb-1" />
                  <span>Change Image</span>
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
              </div>
            </div>

            {/* Inputs */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  id="edit-input-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Director
                  </label>
                  <input
                    id="edit-input-director"
                    type="text"
                    required
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#E50914] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Year
                  </label>
                  <input
                    id="edit-input-year"
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#E50914] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Genre
                </label>
                <select
                  id="edit-input-genre"
                  required
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#E50914] transition-all"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              id="edit-cancel-btn"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-zinc-300 hover:text-white text-sm font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="edit-submit-btn"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white text-sm font-bold shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
