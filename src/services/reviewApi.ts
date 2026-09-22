import { Review } from "../types";
import { apiClient } from "./apiClient";

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

export const getReviewsForMovie = async (
  movieId: string,
): Promise<Review[]> => {
  const { data } = await apiClient.get<BackendReview[]>(
    `/api/movies/${movieId}/reviews`,
  );
  return data.map(normalizeReview);
};

export const createReview = async (
  movieId: string,
  review: Omit<Review, "id" | "movieId" | "createdAt" | "reviewerName">,
): Promise<Review> => {
  const { data } = await apiClient.post<BackendReview>(
    `/api/movies/${movieId}/reviews`,
    review,
  );
  return normalizeReview(data);
};

export const updateReview = async (
  id: string,
  review: Omit<Review, "id" | "movieId" | "createdAt" | "reviewerName">,
): Promise<Review> => {
  const { data } = await apiClient.patch<BackendReview>(
    `/api/reviews/${id}`,
    review,
  );
  return normalizeReview(data);
};

export const deleteReview = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/reviews/${id}`);
};
