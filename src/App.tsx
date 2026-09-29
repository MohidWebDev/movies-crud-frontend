import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { queryKeys } from "./queryKeys";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HeroLanding } from "./components/HeroLanding";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDetails } from "./components/MovieDetails";
import { AddMovieForm } from "./components/AddMovieForm";
import { EditMovieForm } from "./components/EditMovieForm";
import { DeleteModal } from "./components/DeleteModal";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Movie, ToastNotification } from "./types";
import {
  getMovieById,
  createMovie,
  uploadPoster,
  updateMovie,
  deleteMovie,
} from "./services/movieApi";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

// Small wrapper so EditMovieForm can be reached as a route,
// looking up the movie by the :id URL param.
interface EditMovieRouteProps {
  onUpdateMovie: (
    id: string,
    updated: {
      title: string;
      director: string;
      year: number;
      genre: string;
      trailerUrl?: string;
    },
    posterFile: File | null,
  ) => Promise<void>;
}

const EditMovieRoute: React.FC<EditMovieRouteProps> = ({ onUpdateMovie }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.movies.detail(id ?? ""),
    queryFn: () => getMovieById(id as string),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-zinc-400">
        <div className="w-10 h-10 border-2 border-zinc-700 border-t-[#E50914] rounded-full animate-spin mb-4" />
        <p className="text-sm">Loading movie...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-red-400 font-semibold mb-1">Movie not found</p>
        <button
          onClick={() => navigate("/movies")}
          className="px-6 py-2.5 rounded-xl bg-[#E50914] text-white text-sm font-semibold hover:bg-[#F40612] transition-all cursor-pointer mt-4"
        >
          Back to All Movies
        </button>
      </div>
    );
  }

  return (
    <EditMovieForm
      movie={movie}
      onUpdateMovie={onUpdateMovie}
      onCancel={() => navigate(-1)}
    />
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [editOrigin, setEditOrigin] = useState<string>("/movies");
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const queryClient = useQueryClient();

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
    navigate(`/movies/${movie.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEdit = (movie: Movie) => {
    setEditOrigin(location.pathname);
    navigate(`/edit/${movie.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePromptDelete = (movie: Movie) => {
    setMovieToDelete(movie);
  };

  const { mutate: confirmDelete } = useMutation({
    mutationFn: (movie: Movie) => deleteMovie(movie.id),
    onSuccess: (_data, movie) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
      showToast(`"${movie.title}" removed from archive`, "info");
      navigate("/movies");
    },
    onError: (err) => {
      showToast(
        err instanceof Error ? err.message : "Failed to delete movie",
        "error",
      );
    },
    onSettled: () => {
      setMovieToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (!movieToDelete) return;
    confirmDelete(movieToDelete);
  };

  const { mutate: addMovie } = useMutation({
    mutationFn: async ({
      movieData,
      posterFile,
    }: {
      movieData: {
        title: string;
        director: string;
        year: number;
        genre: string;
        trailerUrl?: string;
      };
      posterFile: File | null;
    }) => {
      const newMovie = await createMovie(movieData);
      if (posterFile) {
        await uploadPoster(newMovie.id, posterFile);
      }
      return newMovie;
    },
    onSuccess: (newMovie) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
      showToast(`"${newMovie.title}" added to your archive!`, "success");
      navigate("/movies");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err) => {
      showToast(
        err instanceof Error ? err.message : "Failed to add movie",
        "error",
      );
    },
  });

  const handleAddMovie = async (
    movieData: {
      title: string;
      director: string;
      year: number;
      genre: string;
      trailerUrl?: string;
    },
    posterFile: File | null,
  ) => {
    addMovie({ movieData, posterFile });
  };

  const { mutate: updateMovieMutation } = useMutation({
    mutationFn: async ({
      id,
      updatedData,
      posterFile,
    }: {
      id: string;
      updatedData: {
        title: string;
        director: string;
        year: number;
        genre: string;
        trailerUrl?: string;
      };
      posterFile: File | null;
    }) => {
      await updateMovie(id, updatedData);
      if (posterFile) {
        await uploadPoster(id, posterFile);
      }
      return { id, title: updatedData.title };
    },
    onSuccess: ({ id, title }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.detail(id) });
      showToast(`"${title}" updated successfully!`, "success");
      navigate(editOrigin);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err) => {
      showToast(
        err instanceof Error ? err.message : "Failed to update movie",
        "error",
      );
    },
  });

  const handleUpdateMovie = async (
    id: string,
    updatedData: {
      title: string;
      director: string;
      year: number;
      genre: string;
      trailerUrl?: string;
    },
    posterFile: File | null,
  ) => {
    updateMovieMutation({ id, updatedData, posterFile });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#E50914] selection:text-white font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col min-h-0 min-w-0 w-full">
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route path="/register" element={<RegisterForm />} />

          <Route
            path="/"
            element={<HeroLanding onViewMovies={() => navigate("/movies")} />}
          />

          <Route
            path="/movies"
            element={
              <MovieGrid
                onSelectMovie={handleSelectMovie}
                onEditMovie={handleStartEdit}
                onDeleteMovie={handlePromptDelete}
                onAddMovie={() => navigate("/add")}
              />
            }
          />

          <Route
            path="/movies/:id"
            element={
              <MovieDetailsRoute
                onEdit={handleStartEdit}
                onDelete={handlePromptDelete}
              />
            }
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddMovieForm
                  onAddMovie={handleAddMovie}
                  onCancel={() => navigate("/movies")}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditMovieRoute onUpdateMovie={handleUpdateMovie} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer onNavigateHome={() => navigate("/")} />

      <DeleteModal
        movie={movieToDelete}
        isOpen={Boolean(movieToDelete)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMovieToDelete(null)}
      />

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

interface MovieDetailsRouteProps {
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

const MovieDetailsRoute: React.FC<MovieDetailsRouteProps> = ({
  onEdit,
  onDelete,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <MovieDetails
      movieId={id}
      onBack={() => navigate("/movies")}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
