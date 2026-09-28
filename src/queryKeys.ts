export interface MoviesListParams {
  page?: number;
  limit?: number;
  genre?: string;
  sort?: "year";
  search?: string;
}

export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    list: (params: MoviesListParams) => ["movies", "list", params] as const,
    stats: ["movies", "stats"] as const,
    detail: (id: string) => ["movies", "detail", id] as const,
  },
  reviews: {
    byMovie: (movieId: string) => ["reviews", movieId] as const,
  },
};
