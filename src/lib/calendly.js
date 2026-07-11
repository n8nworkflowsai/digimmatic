export function buildCalendlyUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("hide_landing_page_details", "1");
    parsed.searchParams.set("background_color", "090d1c");
    parsed.searchParams.set("text_color", "ffffff");
    parsed.searchParams.set("primary_color", "14d1ff");
    return parsed.toString();
  } catch {
    return `${url}?hide_landing_page_details=1&background_color=090d1c&text_color=ffffff&primary_color=14d1ff`;
  }
}
