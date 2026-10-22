import { Movie, Review, User } from "../types";

export const buildUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  role: "user",
  ...overrides,
});

export const buildMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: "movie-1",
  title: "Inception",
  director: "Christopher Nolan",
  year: 2010,
  genre: "Sci-Fi, Thriller",
  trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  ...overrides,
});

export const buildReview = (overrides: Partial<Review> = {}): Review => ({
  id: "review-1",
  movieId: "movie-1",
  reviewerName: "Alice",
  rating: 4,
  comment: "Great movie",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});
