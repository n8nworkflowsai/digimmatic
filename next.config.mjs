import { buildContentSecurityPolicy } from "./src/lib/content-security-policy.js";

/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const contentSecurityPolicy = buildContentSecurityPolicy(isProduction);

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      'camera=(self "https://calendly.com"), microphone=(self "https://calendly.com"), geolocation=(self "https://calendly.com"), interest-cohort=()',
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

if (isProduction) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
