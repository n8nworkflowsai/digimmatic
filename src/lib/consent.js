export const CONSENT_STORAGE_KEY = "digimmatic_cookie_consent";

export const CONSENT = Object.freeze({
  ACCEPTED: "accepted",
  DECLINED: "declined",
});

/** Server/hydration placeholder until localStorage is read on the client. */
export const CONSENT_PENDING = "pending";

const listeners = new Set();
let cachedConsent = undefined;

export function parseConsentValue(value) {
  if (value === CONSENT.ACCEPTED || value === CONSENT.DECLINED) {
    return value;
  }

  return null;
}

export function readStoredConsent(storage = globalThis.localStorage) {
  try {
    return parseConsentValue(storage?.getItem?.(CONSENT_STORAGE_KEY) ?? null);
  } catch {
    return null;
  }
}

export function writeStoredConsent(value, storage = globalThis.localStorage) {
  const consent = parseConsentValue(value);

  if (!consent) {
    return false;
  }

  try {
    storage?.setItem?.(CONSENT_STORAGE_KEY, consent);
    return true;
  } catch {
    return false;
  }
}

export function hasAnalyticsConsent(consent) {
  return consent === CONSENT.ACCEPTED;
}

function readClientConsent() {
  if (cachedConsent === undefined) {
    cachedConsent = readStoredConsent();
  }

  return cachedConsent;
}

export function getConsentSnapshot() {
  if (typeof window === "undefined") {
    return CONSENT_PENDING;
  }

  return readClientConsent();
}

export function getServerConsentSnapshot() {
  return CONSENT_PENDING;
}

export function subscribeConsent(listener) {
  listeners.add(listener);

  const onStorage = (event) => {
    if (event.key === CONSENT_STORAGE_KEY || event.key === null) {
      cachedConsent = undefined;
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function setConsentChoice(value) {
  if (!writeStoredConsent(value)) {
    return false;
  }

  cachedConsent = parseConsentValue(value);
  listeners.forEach((listener) => listener());
  return true;
}
