export const APOLLO_TRACKER_SRC =
  "https://assets.apollo.io/micro/website-tracker/tracker.iife.js";
export const DEFAULT_APOLLO_APP_ID = "6a36477b3fa91200140817e2";

let loadPromise = null;
let initializedAppId = null;

export function getApolloAppId() {
  return (
    process.env.NEXT_PUBLIC_APOLLO_APP_ID?.trim() || DEFAULT_APOLLO_APP_ID
  );
}

export function buildPageUrl(pathname, searchParams) {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://digimmatic.com";
  const query = searchParams?.toString?.() ?? "";
  return query ? `${origin}${pathname}?${query}` : `${origin}${pathname}`;
}

export function loadApolloTracker(appId) {
  if (typeof window === "undefined" || !appId) {
    return Promise.resolve(false);
  }

  if (initializedAppId === appId && window.trackingFunctions?.appId === appId) {
    return Promise.resolve(true);
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const nocache = Math.random().toString(36).substring(7);
      const script = document.createElement("script");
      script.src = `${APOLLO_TRACKER_SRC}?nocache=${nocache}`;
      script.async = true;
      script.defer = true;
      script.onload = async () => {
        try {
          await window.trackingFunctions.onLoad({ appId });
          initializedAppId = appId;
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => {
        reject(new Error("Failed to load Apollo website visitor tracker."));
      };
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}

export function trackApolloPageVisit(url) {
  if (
    typeof window === "undefined" ||
    typeof window.trackingFunctions?.sendPageVisitEvent !== "function"
  ) {
    return Promise.resolve(false);
  }

  return window.trackingFunctions.sendPageVisitEvent(url);
}

export function resetApolloTrackerForTests() {
  loadPromise = null;
  initializedAppId = null;
}
