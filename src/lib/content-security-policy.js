const GA4_CONNECT_SRC = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  "https://*.g.doubleclick.net",
].join(" ");

const GA4_IMG_SRC = [
  "https://*.google-analytics.com",
  "https://*.googletagmanager.com",
  "https://*.g.doubleclick.net",
].join(" ");

const GA4_SCRIPT_SRC = "https://*.googletagmanager.com";

export function buildContentSecurityPolicy(isProduction) {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isProduction ? [] : ["'unsafe-eval'"]),
    GA4_SCRIPT_SRC,
    "https://va.vercel-scripts.com",
  ].join(" ");

  const connectSrc = [
    "'self'",
    ...(isProduction ? [] : ["ws:", "wss:"]),
    GA4_CONNECT_SRC,
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
    "https://*.calendly.com",
  ].join(" ");

  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    "https://lh3.googleusercontent.com",
    GA4_IMG_SRC,
  ].join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "font-src 'self'",
    "frame-src https://calendly.com https://*.calendly.com",
    `connect-src ${connectSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}
