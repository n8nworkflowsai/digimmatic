export const DEFAULT_GA_MEASUREMENT_ID = "G-TTM1HVZF3B";

export const GOOGLE_CONSENT_DENIED = Object.freeze({
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "granted",
  personalization_storage: "denied",
  security_storage: "granted",
});

export const GOOGLE_CONSENT_GRANTED = Object.freeze({
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  functionality_storage: "granted",
  personalization_storage: "granted",
  security_storage: "granted",
});

export function getGaMeasurementId() {
  const fromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set; using default measurement ID.",
    );
  }

  return DEFAULT_GA_MEASUREMENT_ID;
}

export function getGtmId() {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
}

export function buildConsentState(granted) {
  return granted ? { ...GOOGLE_CONSENT_GRANTED } : { ...GOOGLE_CONSENT_DENIED };
}

export function gaDisableKey(measurementId) {
  return `ga-disable-${measurementId}`;
}

/** Push Consent Mode defaults before any Google tags load. */
export function setDefaultGoogleConsent(gtag = getClientGtag()) {
  if (!gtag) {
    return false;
  }

  gtag("consent", "default", {
    ...GOOGLE_CONSENT_DENIED,
    wait_for_update: 500,
  });
  return true;
}

/** Update Consent Mode after the user accepts or declines. */
export function updateGoogleConsent(granted, gtag = getClientGtag()) {
  if (!gtag) {
    return false;
  }

  gtag("consent", "update", buildConsentState(granted));
  return true;
}

/**
 * Enable or disable Google tracking for the current page session.
 * When disabled, also flips GA's official `ga-disable-*` kill switch.
 */
export function applyTrackingConsent({
  granted,
  measurementId,
  gtag = getClientGtag(),
  target = typeof globalThis !== "undefined" ? globalThis : undefined,
} = {}) {
  if (measurementId && target) {
    target[gaDisableKey(measurementId)] = !granted;
  }

  return updateGoogleConsent(granted, gtag);
}

function getClientGtag() {
  if (typeof window === "undefined") {
    return null;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag === "function") {
    return window.gtag.bind(window);
  }

  function gtag(...args) {
    window.dataLayer.push(args);
  }

  window.gtag = gtag;
  return gtag;
}
