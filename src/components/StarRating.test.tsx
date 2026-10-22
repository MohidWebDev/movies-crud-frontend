import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StarRating } from "./StarRating";

const FILLED_CLASS = "fill-[#E50914]";

const getStars = () => screen.getAllByRole("button");

const filledCount = () =>
  getStars().filter((star) =>
    star.querySelector("svg")?.classList.contains(FILLED_CLASS),
  ).length;

describe("StarRating", () => {
  it("renders five star buttons", () => {
    render(<StarRating value={3} />);

    expect(getStars()).toHaveLength(5);
  });

  it.each([0, 1, 3, 5])(
    "fills the right number of stars for value %i",
    (value) => {
      render(<StarRating value={value} />);

      expect(filledCount()).toBe(value);
    },
  );

  it("is read-only when no onChange is given", () => {
    render(<StarRating value={4} />);

    getStars().forEach((star) => expect(star).toBeDisabled());
  });

  it("is interactive when onChange is given", () => {
    render(<StarRating value={4} onChange={jest.fn()} />);

    getStars().forEach((star) => expect(star).toBeEnabled());
  });

  it.each([1, 2, 3, 4, 5])(
    "calls onChange with %i when star number %i is clicked",
    async (starNumber) => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<StarRating value={0} onChange={onChange} />);

      await user.click(getStars()[starNumber - 1]);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(starNumber);
    },
  );

  it("does not change its own display, since the parent owns the value", async () => {
    const user = userEvent.setup();
    render(<StarRating value={2} onChange={jest.fn()} />);

    await user.click(getStars()[4]);

    expect(filledCount()).toBe(2);
  });

  it("uses 20px icons by default and respects the size prop", () => {
    const { container, rerender } = render(<StarRating value={1} />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "20");

    rerender(<StarRating value={1} size={32} />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "32");
  });
});
