export const DEFAULT_GA_MEASUREMENT_ID = "G-TTM1HVZF3B";

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
