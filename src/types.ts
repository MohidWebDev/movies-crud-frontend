export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  genre: string;
  posterUrl?: string;
}

export type ViewMode = "home" | "movies" | "details" | "add" | "edit";

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
