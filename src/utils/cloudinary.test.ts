import { optimizePosterUrl } from "./cloudinary";

const ORIGINAL =
  "https://res.cloudinary.com/demo/image/upload/v1700000000/movie-posters/abc.jpg";

describe("optimizePosterUrl", () => {
  it("adds resize, auto format and auto quality after /upload/", () => {
    expect(optimizePosterUrl(ORIGINAL, 400)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400,c_limit/v1700000000/movie-posters/abc.jpg",
    );
  });

  it("uses the width it is given", () => {
    expect(optimizePosterUrl(ORIGINAL, 800)).toContain("w_800,c_limit");
  });

  it("returns an empty or missing url unchanged", () => {
    expect(optimizePosterUrl(undefined, 400)).toBeUndefined();
    expect(optimizePosterUrl("", 400)).toBe("");
  });

  it("leaves non-Cloudinary urls alone", () => {
    const url = "https://example.com/posters/abc.jpg";

    expect(optimizePosterUrl(url, 400)).toBe(url);
  });

  it("leaves urls that already have a transformation alone", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/w_300/v1700000000/movie-posters/abc.jpg";

    expect(optimizePosterUrl(url, 400)).toBe(url);
  });

  it("leaves urls without a version segment alone", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/movie-posters/abc.jpg";

    expect(optimizePosterUrl(url, 400)).toBe(url);
  });

  it("leaves non-image Cloudinary urls alone", () => {
    const url =
      "https://res.cloudinary.com/demo/video/upload/v1700000000/clip.mp4";

    expect(optimizePosterUrl(url, 400)).toBe(url);
  });
});
