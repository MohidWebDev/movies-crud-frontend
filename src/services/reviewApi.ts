import { Review } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const MOVIES_URL = `${API_BASE_URL}/api/movies`;
const REVIEWS_URL = `${API_BASE_URL}/api/reviews`;

interface BackendReview {
  _id: string;
  movie: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

const normalizeReview = (review: BackendReview): Review => ({
  id: review._id,
  movieId: review.movie,
  reviewerName: review.reviewerName,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,
});

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Something went wrong");
  }
  return res.json();
};

export const getReviewsForMovie = async (
  movieId: string,
): Promise<Review[]> => {
  const res = await fetch(`${MOVIES_URL}/${movieId}/reviews`);
  const data: BackendReview[] = await handleResponse(res);
  return data.map(normalizeReview);
};

export const createReview = async (
  movieId: string,
  review: Omit<Review, "id" | "movieId" | "createdAt">,
): Promise<Review> => {
  const res = await fetch(`${MOVIES_URL}/${movieId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  const data: BackendReview = await handleResponse(res);
  return normalizeReview(data);
};

export const updateReview = async (
  id: string,
  review: Omit<Review, "id" | "movieId" | "createdAt">,
): Promise<Review> => {
  const res = await fetch(`${REVIEWS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  const data: BackendReview = await handleResponse(res);
  return normalizeReview(data);
};

export const deleteReview = async (id: string): Promise<void> => {
  const res = await fetch(`${REVIEWS_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to delete review");
  }
};
