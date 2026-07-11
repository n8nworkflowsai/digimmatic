import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 5;
const BLOB_STORE_NAME = "send-email-rate-limits";

const store = new Map();
let upstashLimiter = null;
let loggedMemoryFallback = false;

function pruneExpired(now) {
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  }
}

export function computeRetryAfterSeconds(resetAt, now) {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}

export function checkRateLimit(
  key,
  { windowMs = DEFAULT_WINDOW_MS, maxRequests = DEFAULT_MAX_REQUESTS } = {},
) {
  const now = Date.now();

  if (store.size > 1000) {
    pruneExpired(now);
  }

  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: computeRetryAfterSeconds(entry.resetAt, now),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}

function getUpstashLimiter() {
  if (upstashLimiter) {
    return upstashLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  upstashLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(DEFAULT_MAX_REQUESTS, "15 m"),
    prefix: "digimmatic:send-email",
  });

  return upstashLimiter;
}

function isNetlifyRuntime() {
  return Boolean(
    process.env.NETLIFY === "true" ||
      process.env.NETLIFY_DEV === "true" ||
      process.env.NETLIFY_BLOBS_CONTEXT,
  );
}

async function enforceNetlifyBlobRateLimit(key) {
  const { getStore } = await import("@netlify/blobs");
  const blobStore = getStore(BLOB_STORE_NAME);
  const now = Date.now();
  const entry = await blobStore.get(key, { type: "json" });

  if (!entry || now >= entry.resetAt) {
    const nextEntry = { count: 1, resetAt: now + DEFAULT_WINDOW_MS };
    await blobStore.setJSON(key, nextEntry);
    return { allowed: true, remaining: DEFAULT_MAX_REQUESTS - 1 };
  }

  if (entry.count >= DEFAULT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: computeRetryAfterSeconds(entry.resetAt, now),
    };
  }

  const nextEntry = {
    count: entry.count + 1,
    resetAt: entry.resetAt,
  };
  await blobStore.setJSON(key, nextEntry);

  return {
    allowed: true,
    remaining: DEFAULT_MAX_REQUESTS - nextEntry.count,
  };
}

function logMemoryFallbackOnce() {
  if (loggedMemoryFallback || process.env.NODE_ENV !== "production") {
    return;
  }

  loggedMemoryFallback = true;
  console.warn(
    "[rate-limit] No shared store configured; using in-memory rate limiting (not shared across serverless instances). Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or deploy on Netlify for shared limits.",
  );
}

export async function enforceRateLimit(key) {
  const limiter = getUpstashLimiter();

  if (limiter) {
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      retryAfter: result.success
        ? undefined
        : computeRetryAfterSeconds(result.reset, Date.now()),
    };
  }

  if (isNetlifyRuntime()) {
    try {
      return await enforceNetlifyBlobRateLimit(key);
    } catch (error) {
      console.warn("[rate-limit] Netlify Blobs unavailable:", error.message);
    }
  }

  logMemoryFallbackOnce();
  return checkRateLimit(key);
}

export function resetRateLimitStore() {
  store.clear();
  upstashLimiter = null;
  loggedMemoryFallback = false;
}
