"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  buildPageUrl,
  loadApolloTracker,
  trackApolloPageVisit,
} from "@/lib/apollo";

function ApolloRouteTracker({ appId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const skipInitialRoute = useRef(true);

  useEffect(() => {
    if (!appId) {
      return;
    }

    let cancelled = false;

    loadApolloTracker(appId)
      .then(() => {
        if (!cancelled) {
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appId]);

  useEffect(() => {
    if (!ready || !pathname) {
      return;
    }

    if (skipInitialRoute.current) {
      skipInitialRoute.current = false;
      return;
    }

    trackApolloPageVisit(buildPageUrl(pathname, searchParams));
  }, [ready, pathname, searchParams]);

  return null;
}

export default function ApolloTracker({ appId }) {
  if (!appId) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ApolloRouteTracker appId={appId} />
    </Suspense>
  );
}
