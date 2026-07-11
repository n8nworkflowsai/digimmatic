"use client";

import { useCallback, useState } from "react";

export default function useCalendlyRefresh() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerManualRefresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return { refreshKey, triggerManualRefresh };
}
