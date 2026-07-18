"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import ApolloTracker from "@/components/ApolloTracker";
import ConsentBanner from "@/components/ConsentBanner";
import VercelInsights from "@/components/VercelInsights";
import { applyTrackingConsent } from "@/lib/analytics";
import {
  CONSENT_PENDING,
  getConsentSnapshot,
  getServerConsentSnapshot,
  hasAnalyticsConsent,
  subscribeConsent,
} from "@/lib/consent";

let lastAppliedConsentKey = null;

function syncTrackingConsent(consent, measurementId) {
  if (typeof window === "undefined" || consent === CONSENT_PENDING) {
    return false;
  }

  const granted = hasAnalyticsConsent(consent);
  const key = `${consent}:${measurementId ?? ""}`;

  if (lastAppliedConsentKey !== key) {
    lastAppliedConsentKey = key;
    applyTrackingConsent({
      granted,
      measurementId,
    });
  }

  return granted;
}

export default function AnalyticsProvider({
  gaId,
  gtmId = "",
  apolloAppId = "",
  enableGoogleAnalytics = false,
}) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  const trackingEnabled = syncTrackingConsent(consent, gaId);
  const enableGtm = Boolean(gtmId);
  const enableGa = Boolean(enableGoogleAnalytics && gaId);

  return (
    <>
      <ConsentBanner />
      {trackingEnabled ? <VercelInsights /> : null}
      {trackingEnabled && enableGtm ? (
        <GoogleTagManager gtmId={gtmId} />
      ) : null}
      {trackingEnabled && enableGa ? <GoogleAnalytics gaId={gaId} /> : null}
      {trackingEnabled && apolloAppId ? (
        <ApolloTracker appId={apolloAppId} />
      ) : null}
    </>
  );
}
