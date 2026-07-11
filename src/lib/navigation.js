export const NAV_LINKS = [
  { id: "solutions", label: "Solutions", href: "/" },
  { id: "workflows", label: "Workflows", href: "/workflows" },
  { id: "success", label: "Success", href: "/success" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const MOBILE_NAV_LINKS = [
  { id: "solutions", label: "Core Solutions", href: "/" },
  { id: "workflows", label: "Automation Workflows", href: "/workflows" },
  { id: "success", label: "Success Stories & Case Studies", href: "/success" },
  {
    id: "contact",
    label: "Request Audit & Consultation",
    href: "/contact",
  },
];

export const FOOTER_LINKS = [
  { id: "solutions", label: "Solutions", href: "/" },
  { id: "workflows", label: "Workflows", href: "/workflows" },
  { id: "success", label: "Success cases", href: "/success" },
  {
    id: "contact",
    label: "Book discovery",
    href: "/contact",
    scrollToCalendly: true,
  },
];

export function getActiveNavId(pathname) {
  if (pathname === "/workflows") return "workflows";
  if (pathname === "/success") return "success";
  if (pathname === "/contact") return "contact";
  return "solutions";
}
