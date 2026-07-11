/** Coerce optional form fields to trimmed strings without throwing. */
export function normalizeTextField(value) {
  if (value == null || typeof value !== "string") {
    return "";
  }

  return value.trim();
}

/** Strip control chars and newlines to prevent email header injection. */
export function sanitizeEmailHeader(value) {
  return String(value)
    .replace(/[\r\n\u0000-\u001f\u007f]/g, "")
    .trim();
}

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email) {
  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email)) {
    return false;
  }

  const atIndex = email.lastIndexOf("@");
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
    return false;
  }

  return true;
}

export function parseAndValidateSolutions(solutions, allowedLabels) {
  if (typeof solutions !== "string" || !solutions.trim()) {
    return { ok: false, error: "At least one AI Solution must be selected." };
  }

  const selected = solutions
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (selected.length === 0) {
    return { ok: false, error: "At least one AI Solution must be selected." };
  }

  const allowed = new Set(allowedLabels);
  for (const label of selected) {
    if (!allowed.has(label)) {
      return { ok: false, error: "Invalid solution selection." };
    }
  }

  return { ok: true, value: selected.join(", ") };
}

export function getClientIp(request) {
  const netlifyIp = request.headers.get("x-nf-client-connection-ip")?.trim();
  if (netlifyIp) {
    return netlifyIp;
  }

  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelIp) {
    return vercelIp.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
}

const DEFAULT_FIELD_LIMITS = {
  name: 100,
  company: 200,
  email: 254,
  phone: 30,
  solutions: 500,
};

function fieldTooLong(value, max) {
  return typeof value === "string" && value.length > max;
}

export function validateDiscoveryPayload(body, allowedLabels) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "Invalid request body." };
  }

  if (normalizeTextField(body._hp_website)) {
    return { ok: true, honeypot: true };
  }

  const name = normalizeTextField(body.name);
  const company = normalizeTextField(body.company);
  const email = normalizeTextField(body.email);
  const phone = normalizeTextField(body.phone);
  const solutionsInput = normalizeTextField(body.solutions);

  if (!name || !company || !email || !phone) {
    return {
      ok: false,
      status: 400,
      error: "All required fields must be provided.",
    };
  }

  const solutionsResult = parseAndValidateSolutions(solutionsInput, allowedLabels);
  if (!solutionsResult.ok) {
    return { ok: false, status: 400, error: solutionsResult.error };
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      status: 400,
      error: "Please provide a valid email address.",
    };
  }

  if (
    fieldTooLong(name, DEFAULT_FIELD_LIMITS.name) ||
    fieldTooLong(company, DEFAULT_FIELD_LIMITS.company) ||
    fieldTooLong(email, DEFAULT_FIELD_LIMITS.email) ||
    fieldTooLong(phone, DEFAULT_FIELD_LIMITS.phone) ||
    fieldTooLong(solutionsResult.value, DEFAULT_FIELD_LIMITS.solutions)
  ) {
    return {
      ok: false,
      status: 400,
      error: "One or more fields exceed the maximum allowed length.",
    };
  }

  return {
    ok: true,
    payload: {
      name,
      company,
      email,
      phone,
      solutions: solutionsResult.value,
    },
  };
}
