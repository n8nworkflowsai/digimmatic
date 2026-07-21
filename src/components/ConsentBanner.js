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
          className="fixed bottom-0 left-0 z-[60] w-full max-w-full overflow-x-clip p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none sm:p-6"
        >
          <div className="pointer-events-auto mx-auto w-full min-w-0 max-w-3xl rounded-2xl border border-white/15 bg-[#0b1220] px-4 py-3.5 shadow-2xl shadow-black/50 sm:px-6 sm:py-5">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0 space-y-1">
                <p
                  id="cookie-consent-title"
                  className="text-sm font-semibold text-slate-100"
                >
                  We use cookies for analytics
                </p>
                <p
                  id="cookie-consent-description"
                  className="text-xs leading-relaxed text-slate-400 break-words"
                >
                  Cookies help us measure site use and identify visiting
                  companies. Tracking starts only if you accept.
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:items-center sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full min-w-0 px-3 py-2.5 text-xs sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                  onClick={() => setConsentChoice(CONSENT.DECLINED)}
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full min-w-0 px-3 py-2.5 text-xs sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
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
