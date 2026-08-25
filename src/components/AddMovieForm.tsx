import React, { useState } from "react";
import { motion } from "motion/react";
import { UploadCloud, X, ArrowLeft } from "lucide-react";

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

interface AddMovieFormProps {
  onAddMovie: (
    movie: { title: string; director: string; year: number; genre: string },
    posterFile: File | null,
  ) => Promise<void>;
  onCancel: () => void;
}

export const AddMovieForm: React.FC<AddMovieFormProps> = ({
  onAddMovie,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState<string[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
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

  const toggleGenre = (g: string) => {
    setGenre((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g],
    );
  };

  const handleRemovePoster = () => {
    setPosterFile(null);
    setPosterPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !director.trim() || !year.trim() || genre.length === 0)
      return;

    setIsSubmitting(true);
    try {
      await onAddMovie(
        {
          title: title.trim(),
          director: director.trim(),
          year: Number(year),
          genre: genre.join(","),
        },
        posterFile,
      );
    } finally {
      setIsSubmitting(false);
    }
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
              Poster Image (optional)
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
              {posterPreview ? (
                <div className="relative inline-block">
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    className="h-44 object-cover rounded-lg shadow-md mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePoster}
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

          {/* Form Fields */}
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
                Release Year *
              </label>
              <input
                id="input-year"
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Genre * (select one or more)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#181818] border border-zinc-800 text-sm text-zinc-300 cursor-pointer hover:border-zinc-700"
                >
                  <input
                    type="checkbox"
                    checked={genre.includes(g)}
                    onChange={() => toggleGenre(g)}
                    className="accent-[#E50914]"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <motion.button
            id="submit-add-movie-btn"
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full py-3.5 rounded-xl bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Movie"}
          </motion.button>
        </form>
      </div>
    </div>
  );
};
