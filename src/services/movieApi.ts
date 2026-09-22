import { Movie } from "../types";
import { apiClient } from "./apiClient";

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
  trailerUrl?: string;
}

interface GetMoviesParams {
  page?: number;
  limit?: number;
  genre?: string;
  sort?: "year";
  search?: string;
}

interface PaginatedMovies {
  data: Movie[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export interface TopMovie {
  _id: string;
  title: string;
  year: number;
  poster?: {
    url: string;
    publicId: string;
  };
  averageRating: number;
  reviewCount: number;
}

// Converts a backend movie object into the shape our frontend expects
const normalizeMovie = (movie: BackendMovie): Movie => ({
  id: movie._id,
  title: movie.title,
  director: movie.director,
  year: movie.year,
  genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
  posterUrl: movie.poster?.url,
  trailerUrl: movie.trailerUrl,
});

export const getAllMovies = async (
  params: GetMoviesParams = {},
): Promise<PaginatedMovies> => {
  const { data: result } = await apiClient.get("/api/movies", { params });

  return {
    data: result.data.map(normalizeMovie),
    page: result.page,
    totalPages: result.totalPages,
    totalCount: result.totalCount,
  };
};

export const getMovieStats = async (): Promise<TopMovie[]> => {
  const { data } = await apiClient.get("/api/movies/stats");
  return data;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const { data } = await apiClient.get<BackendMovie>(`/api/movies/${id}`);
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
  const { data } = await apiClient.post<BackendMovie>("/api/movies", payload);
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
  const { data } = await apiClient.put<BackendMovie>(
    `/api/movies/${id}`,
    payload,
  );
  return normalizeMovie(data);
};

export const deleteMovie = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/movies/${id}`);
};

export const uploadPoster = async (id: string, file: File): Promise<Movie> => {
  const formData = new FormData();
  formData.append("poster", file);

  const { data } = await apiClient.post<BackendMovie>(
    `/api/movies/${id}/poster`,
    formData,
  );
  return normalizeMovie(data);
};
