import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddReviewForm } from "./AddReviewForm";
import { createReview } from "../services/reviewApi";
import { renderWithProviders } from "../test/renderWithProviders";
import { mockAuth } from "../test/mocks";
import { buildReview, buildUser } from "../test/factories";
import { Review } from "../types";

jest.mock("../context/AuthContext");
jest.mock("../services/reviewApi");

const MOVIE_ID = "movie-42";
const FILLED_CLASS = "fill-[#E50914]";

const renderForm = () =>
  renderWithProviders(<AddReviewForm movieId={MOVIE_ID} />);

// The five star buttons are the only type="button" buttons in the form
const getStars = () =>
  screen
    .getAllByRole("button")
    .filter((button) => button.getAttribute("type") === "button");

const filledCount = () =>
  getStars().filter((star) =>
    star.querySelector("svg")?.classList.contains(FILLED_CLASS),
  ).length;

beforeEach(() => {
  mockAuth({ user: buildUser() });
  jest.mocked(createReview).mockResolvedValue(buildReview());
});

describe("AddReviewForm", () => {
  it("renders the heading, five stars, a comment box and a submit button", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: "Write a Review" }),
    ).toBeInTheDocument();
    expect(getStars()).toHaveLength(5);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Review" })).toBeEnabled();
  });

  it("fills the stars up to the one that was clicked", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(filledCount()).toBe(0);

    await user.click(getStars()[3]);
    expect(filledCount()).toBe(4);

    await user.click(getStars()[1]);
    expect(filledCount()).toBe(2);
  });

  it("submits the rating and trimmed comment, then resets the form", async () => {
    const user = userEvent.setup();
    const { queryClient } = renderForm();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    await user.click(getStars()[3]);
    await user.type(screen.getByRole("textbox"), "  Loved it  ");
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    await waitFor(() =>
      expect(createReview).toHaveBeenCalledWith(MOVIE_ID, {
        rating: 4,
        comment: "Loved it",
      }),
    );
    await waitFor(() =>
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["reviews", MOVIE_ID],
      }),
    );
    await waitFor(() => expect(screen.getByRole("textbox")).toHaveValue(""));
    expect(filledCount()).toBe(0);
  });

  it("sends no comment when the comment box is blank", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(getStars()[4]);
    await user.type(screen.getByRole("textbox"), "   ");
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    await waitFor(() =>
      expect(createReview).toHaveBeenCalledWith(MOVIE_ID, {
        rating: 5,
        comment: undefined,
      }),
    );
  });

  it("does not submit when no rating was chosen", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole("textbox"), "Nice");
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    expect(createReview).not.toHaveBeenCalled();
  });

  it("does not submit when nobody is logged in", async () => {
    const user = userEvent.setup();
    mockAuth({ user: null });
    renderForm();

    await user.click(getStars()[2]);
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    expect(createReview).not.toHaveBeenCalled();
  });

  it("disables the button and shows progress while submitting", async () => {
    const user = userEvent.setup();
    let finishReview!: (review: Review) => void;
    jest.mocked(createReview).mockImplementation(
      () =>
        new Promise<Review>((resolve) => {
          finishReview = resolve;
        }),
    );
    renderForm();

    await user.click(getStars()[2]);
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    const pendingButton = await screen.findByRole("button", {
      name: "Submitting...",
    });
    expect(pendingButton).toBeDisabled();

    finishReview(buildReview());
    expect(
      await screen.findByRole("button", { name: "Submit Review" }),
    ).toBeEnabled();
  });

  it("shows the error and keeps the user's rating when submitting fails", async () => {
    const user = userEvent.setup();
    jest.mocked(createReview).mockRejectedValue(new Error("Network down"));
    renderForm();

    await user.click(getStars()[3]);
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    expect(await screen.findByText("Network down")).toBeInTheDocument();
    expect(filledCount()).toBe(4);
  });

  it("falls back to a generic message when the error is not an Error", async () => {
    const user = userEvent.setup();
    jest.mocked(createReview).mockRejectedValue("nope");
    renderForm();

    await user.click(getStars()[0]);
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    expect(await screen.findByText("Failed to add review")).toBeInTheDocument();
  });
});
