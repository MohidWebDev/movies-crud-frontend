export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  genre: string;
  posterUrl?: string;
  trailerUrl?: string;
}

export interface Review {
  id: string;
  movieId: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
