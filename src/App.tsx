import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HeroLanding } from "./components/HeroLanding";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDetails } from "./components/MovieDetails";
import { AddMovieForm } from "./components/AddMovieForm";
import { EditMovieForm } from "./components/EditMovieForm";
import { DeleteModal } from "./components/DeleteModal";
import { Movie, ViewMode, ToastNotification } from "./types";
import { getAllMovies } from "./services/movieApi";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<ViewMode>("home");
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Fetch movies from the backend on initial load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMovies();
        setMovies(data);
        setLoadError(null);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load movies",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setCurrentView("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEdit = (movie: Movie) => {
    setMovieToEdit(movie);
    setCurrentView("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePromptDelete = (movie: Movie) => {
    setMovieToDelete(movie);
  };

  const handleConfirmDelete = () => {
    if (!movieToDelete) return;
    setMovies((prev) => prev.filter((m) => m.id !== movieToDelete.id));
    showToast(`"${movieToDelete.title}" removed from archive`, "info");
    setMovieToDelete(null);

    // If viewing the deleted movie in details, navigate back to grid
    if (selectedMovieId === movieToDelete.id) {
      setSelectedMovieId(null);
      setCurrentView("movies");
    }
  };

  const handleAddMovie = (newMovieData: Omit<Movie, "id" | "createdAt">) => {
    const newMovie: Movie = {
      ...newMovieData,
      id:
        "movie-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
    };
    setMovies((prev) => [newMovie, ...prev]);
    showToast(`"${newMovie.title}" added to your archive!`, "success");
    setCurrentView("movies");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateMovie = (updated: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`"${updated.title}" updated successfully!`, "success");
    if (selectedMovieId === updated.id) {
      setCurrentView("details"); // MovieDetails will refetch automatically
    } else {
      setCurrentView("movies");
    }
    setMovieToEdit(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.35, ease: "easeOut" },
  };

  return (
    <div
      className={`min-h-screen ${
        currentView === "home" ? "h-screen overflow-hidden" : ""
      } flex flex-col bg-[#0A0A0A] text-white selection:bg-[#E50914] selection:text-white font-sans`}
    >
      {/* Global Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Page Route Container with Cross-Fade Animations */}
      <main className="flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home"
              className="flex-1 flex flex-col min-h-0"
              {...pageTransition}
            >
              <HeroLanding onViewMovies={() => handleNavigate("movies")} />
            </motion.div>
          )}

          {currentView === "movies" && (
            <motion.div key="movies" {...pageTransition}>
              <MovieGrid
                movies={movies}
                isLoading={isLoading}
                error={loadError}
                onSelectMovie={handleSelectMovie}
                onEditMovie={handleStartEdit}
                onDeleteMovie={handlePromptDelete}
                onAddMovie={() => handleNavigate("add")}
              />
            </motion.div>
          )}

          {currentView === "details" && selectedMovieId && (
            <motion.div key="details" {...pageTransition}>
              <MovieDetails
                movieId={selectedMovieId}
                onBack={() => handleNavigate("movies")}
                onEdit={handleStartEdit}
                onDelete={handlePromptDelete}
              />
            </motion.div>
          )}

          {currentView === "add" && (
            <motion.div key="add" {...pageTransition}>
              <AddMovieForm
                onAddMovie={handleAddMovie}
                onCancel={() => handleNavigate("movies")}
              />
            </motion.div>
          )}

          {currentView === "edit" && movieToEdit && (
            <motion.div key="edit" {...pageTransition}>
              <EditMovieForm
                movie={movieToEdit}
                onUpdateMovie={handleUpdateMovie}
                onCancel={() =>
                  selectedMovieId
                    ? handleNavigate("details")
                    : handleNavigate("movies")
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigateHome={() => handleNavigate("home")} />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        movie={movieToDelete}
        isOpen={Boolean(movieToDelete)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMovieToDelete(null)}
      />

      {/* Floating Toast Feedback Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-[#181818] border border-zinc-700 text-white shadow-2xl text-sm font-medium"
            >
              {toast.type === "success" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-4 h-4 text-[#E50914]" />
              )}
              {toast.type === "info" && (
                <Info className="w-4 h-4 text-blue-400" />
              )}
              <span>{toast.message}</span>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="ml-2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
