const UPLOAD_MARKER = "/image/upload/";

// Adds Cloudinary delivery options to a poster URL: automatic format
// (WebP/AVIF where supported), automatic quality, and a maximum width.
// Anything that is not a plain Cloudinary image URL is returned unchanged.
export const optimizePosterUrl = (
  url: string | undefined,
  width: number,
): string | undefined => {
  if (!url || !url.includes("//res.cloudinary.com/")) return url;

  const markerIndex = url.indexOf(UPLOAD_MARKER);
  if (markerIndex === -1) return url;

  const insertAt = markerIndex + UPLOAD_MARKER.length;
  const rest = url.slice(insertAt);

  // Only touch plain upload URLs (a version like "v1700000000/" comes first).
  // If a transformation is already there, leave it as it is.
  if (!/^v\d+\//.test(rest)) return url;

  return `${url.slice(0, insertAt)}f_auto,q_auto,w_${width},c_limit/${rest}`;
};
