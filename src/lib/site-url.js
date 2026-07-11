export function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }

  const netlify =
    process.env.URL?.trim() || process.env.DEPLOY_URL?.trim();
  if (netlify) {
    return netlify.startsWith("http")
      ? netlify.replace(/\/$/, "")
      : `https://${netlify.replace(/\/$/, "")}`;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://digimmatic.com";
  }

  return "http://localhost:3000";
}
