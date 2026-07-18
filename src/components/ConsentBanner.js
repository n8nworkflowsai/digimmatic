"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import {
  CONSENT,
  getConsentSnapshot,
  getServerConsentSnapshot,
  setConsentChoice,
  subscribeConsent,
} from "@/lib/consent";

export default function ConsentBanner() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  return (
    <AnimatePresence>
      {consent === null ? (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl glass-card rounded-2xl border border-white/10 bg-[#030712]/95 px-5 py-4 sm:px-6 sm:py-5 shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0 space-y-1.5">
                <p
                  id="cookie-consent-title"
                  className="text-sm font-semibold text-slate-100"
                >
                  We use cookies for analytics
                </p>
                <p
                  id="cookie-consent-description"
                  className="text-xs leading-relaxed text-slate-400 font-mono"
                >
                  We use cookies and similar technologies to understand how the
                  site is used, identify visiting companies, and improve your
                  experience. Analytics and visitor tracking only load if you
                  accept.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2 text-xs sm:text-sm"
                  onClick={() => setConsentChoice(CONSENT.DECLINED)}
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="px-4 py-2 text-xs sm:text-sm"
                  onClick={() => setConsentChoice(CONSENT.ACCEPTED)}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
