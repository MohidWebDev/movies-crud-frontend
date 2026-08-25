import { Movie } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const MOVIES_URL = `${API_BASE_URL}/api/movies`;

// Backend's raw shape before we normalize it for the frontend
interface BackendMovie {
  _id: string;
  title: string;
  director: string;
  year: number;
  genre: string[];
  poster?: {
    url: string;
    publicId: string;
  };
}

// Converts a backend movie object into the shape our frontend expects
const normalizeMovie = (movie: BackendMovie): Movie => ({
  id: movie._id,
  title: movie.title,
  director: movie.director,
  year: movie.year,
  genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
  posterUrl: movie.poster?.url,
});

// Handles non-2xx responses consistently across all requests
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Something went wrong");
  }
  return res.json();
};

export const getAllMovies = async (): Promise<Movie[]> => {
  const res = await fetch(MOVIES_URL);
  const data: BackendMovie[] = await handleResponse(res);
  return data.map(normalizeMovie);
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${MOVIES_URL}/${id}`);
  const data: BackendMovie = await handleResponse(res);
  return normalizeMovie(data);
};

export const createMovie = async (
  movie: Omit<Movie, "id" | "posterUrl">,
): Promise<Movie> => {
  const payload = {
    ...movie,
    genre: movie.genre
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean),
  };
  const res = await fetch(MOVIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: BackendMovie = await handleResponse(res);
  return normalizeMovie(data);
};

export const updateMovie = async (
  id: string,
  movie: Omit<Movie, "id" | "posterUrl">,
): Promise<Movie> => {
  const payload = {
    ...movie,
    genre: movie.genre
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean),
  };
  const res = await fetch(`${MOVIES_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: BackendMovie = await handleResponse(res);
  return normalizeMovie(data);
};

export const deleteMovie = async (id: string): Promise<void> => {
  const res = await fetch(`${MOVIES_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to delete movie");
  }
};

export const uploadPoster = async (id: string, file: File): Promise<Movie> => {
  const formData = new FormData();
  formData.append("poster", file);

  const res = await fetch(`${MOVIES_URL}/${id}/poster`, {
    method: "POST",
    body: formData, // no Content-Type header — browser sets it with boundary automatically
  });
  const data: BackendMovie = await handleResponse(res);
  return normalizeMovie(data);
};
