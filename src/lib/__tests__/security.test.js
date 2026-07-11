import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCalendlyUrl } from "../calendly.js";
import { buildContentSecurityPolicy } from "../content-security-policy.js";
import { DEFAULT_GA_MEASUREMENT_ID, getGaMeasurementId } from "../analytics.js";
import { calculateROI, ROI_EFFICIENCY_RATE } from "../roi.js";
import { resolveSiteUrl } from "../site-url.js";
import {
  checkRateLimit,
  computeRetryAfterSeconds,
  resetRateLimitStore,
} from "../rate-limit.js";
import {
  getClientIp,
  isValidEmail,
  normalizeTextField,
  parseAndValidateSolutions,
  sanitizeEmailHeader,
  validateDiscoveryPayload,
} from "../validation.js";
import { SOLUTION_LABELS } from "../constants.js";

function mockRequest(headers) {
  return {
    headers: {
      get(name) {
        const key = Object.keys(headers).find(
          (header) => header.toLowerCase() === name.toLowerCase(),
        );
        return key ? headers[key] : null;
      },
    },
  };
}

describe("normalizeTextField", () => {
  it("returns trimmed strings and empty values for non-strings", () => {
    assert.equal(normalizeTextField("  hello  "), "hello");
    assert.equal(normalizeTextField(true), "");
    assert.equal(normalizeTextField(123), "");
    assert.equal(normalizeTextField(null), "");
  });
});

describe("sanitizeEmailHeader", () => {
  it("removes CRLF injection characters", () => {
    assert.equal(
      sanitizeEmailHeader("Acme\r\nBcc: evil@example.com"),
      "AcmeBcc: evil@example.com",
    );
  });
});

describe("getClientIp", () => {
  it("prefers Netlify client IP over spoofed x-forwarded-for", () => {
    const request = mockRequest({
      "x-nf-client-connection-ip": "203.0.113.10",
      "x-forwarded-for": "198.51.100.99",
    });

    assert.equal(getClientIp(request), "203.0.113.10");
  });

  it("falls back to x-forwarded-for when platform headers are absent", () => {
    const request = mockRequest({
      "x-forwarded-for": "198.51.100.20, 10.0.0.1",
    });

    assert.equal(getClientIp(request), "198.51.100.20");
  });
});

describe("isValidEmail", () => {
  it("accepts valid addresses", () => {
    assert.equal(isValidEmail("alex@techflow.ai"), true);
    assert.equal(isValidEmail("user.name+tag@example.co.uk"), true);
  });

  it("rejects malformed addresses", () => {
    assert.equal(isValidEmail("not-an-email"), false);
    assert.equal(isValidEmail("a@b"), false);
    assert.equal(isValidEmail("user..name@example.com"), false);
    assert.equal(isValidEmail(".user@example.com"), false);
  });
});

describe("parseAndValidateSolutions", () => {
  it("accepts known solution labels", () => {
    const result = parseAndValidateSolutions(
      "AI Customer Support, Workflow Architecture",
      SOLUTION_LABELS,
    );
    assert.equal(result.ok, true);
    assert.equal(
      result.value,
      "AI Customer Support, Workflow Architecture",
    );
  });

  it("rejects unknown solution labels", () => {
    const result = parseAndValidateSolutions(
      "AI Customer Support, Malicious Payload",
      SOLUTION_LABELS,
    );
    assert.equal(result.ok, false);
  });
});

describe("validateDiscoveryPayload", () => {
  const validBody = {
    name: "Alex Rivera",
    company: "TechFlow Inc.",
    email: "alex@techflow.ai",
    phone: "+971 501234567",
    solutions: "AI Customer Support",
  };

  it("accepts a valid payload", () => {
    const result = validateDiscoveryPayload(validBody, SOLUTION_LABELS);
    assert.equal(result.ok, true);
    assert.equal(result.payload.email, validBody.email);
  });

  it("silently accepts honeypot submissions", () => {
    const result = validateDiscoveryPayload(
      { ...validBody, _hp_website: "https://spam.example" },
      SOLUTION_LABELS,
    );
    assert.equal(result.ok, true);
    assert.equal(result.honeypot, true);
  });

  it("treats non-string honeypot values as empty", () => {
    const result = validateDiscoveryPayload(
      { ...validBody, _hp_website: true },
      SOLUTION_LABELS,
    );
    assert.equal(result.ok, true);
    assert.equal(result.honeypot, undefined);
    assert.equal(result.payload.email, validBody.email);
  });

  it("returns 400 when required fields are non-strings", () => {
    const result = validateDiscoveryPayload(
      { ...validBody, name: 123 },
      SOLUTION_LABELS,
    );
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it("rejects oversize company names", () => {
    const result = validateDiscoveryPayload(
      {
        ...validBody,
        company: "A".repeat(201),
      },
      SOLUTION_LABELS,
    );
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });
});

describe("computeRetryAfterSeconds", () => {
  it("never returns less than 1 second", () => {
    const now = 1_000_000;
    assert.equal(computeRetryAfterSeconds(now, now), 1);
    assert.equal(computeRetryAfterSeconds(now - 500, now), 1);
    assert.equal(computeRetryAfterSeconds(now + 4_500, now), 5);
  });
});

describe("checkRateLimit", () => {
  it("blocks after the configured maximum", () => {
    resetRateLimitStore();
    const key = "test-ip";

    for (let i = 0; i < 5; i += 1) {
      assert.equal(checkRateLimit(key, { maxRequests: 5 }).allowed, true);
    }

    const blocked = checkRateLimit(key, { maxRequests: 5 });
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfter > 0);
    resetRateLimitStore();
  });
});

describe("buildCalendlyUrl", () => {
  it("applies branding params without hiding GDPR banner", () => {
    const url = buildCalendlyUrl("https://calendly.com/n8nworkflowsai/30min");
    assert.match(url, /hide_landing_page_details=1/);
    assert.match(url, /primary_color=14d1ff/);
    assert.doesNotMatch(url, /hide_gdpr_banner=1/);
  });
});

describe("calculateROI", () => {
  it("computes savings using the default efficiency rate", () => {
    const result = calculateROI({
      employees: 5,
      hoursPerWeek: 12,
      hourlyRate: 35,
    });

    assert.equal(result.efficiency, Math.round(ROI_EFFICIENCY_RATE * 100));
    assert.equal(result.weeklyHoursSaved, 5 * 12 * ROI_EFFICIENCY_RATE);
    assert.equal(result.yearlyROI, result.yearlyHours * 35);
  });
});

describe("resolveSiteUrl", () => {
  const originalEnv = { ...process.env };

  it("prefers NEXT_PUBLIC_SITE_URL", () => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SITE_URL: "https://digimmatic.com/",
    };
    assert.equal(resolveSiteUrl(), "https://digimmatic.com");
    process.env = originalEnv;
  });

  it("falls back to production domain when unset in production", () => {
    process.env = {
      NODE_ENV: "production",
    };
    assert.equal(resolveSiteUrl(), "https://digimmatic.com");
    process.env = originalEnv;
  });
});

describe("getGaMeasurementId", () => {
  const originalEnv = { ...process.env };

  it("prefers NEXT_PUBLIC_GA_MEASUREMENT_ID when set", () => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-CUSTOM123",
    };
    assert.equal(getGaMeasurementId(), "G-CUSTOM123");
    process.env = originalEnv;
  });

  it("falls back to the default measurement ID when env is missing", () => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    assert.equal(getGaMeasurementId(), DEFAULT_GA_MEASUREMENT_ID);
    process.env = originalEnv;
  });
});

describe("content security policy", () => {
  it("includes Google Analytics 4 wildcard domains for scripts, connect, and img", () => {
    const productionCsp = buildContentSecurityPolicy(true);
    const developmentCsp = buildContentSecurityPolicy(false);

    assert.match(productionCsp, /script-src[^;]*https:\/\/\*\.googletagmanager\.com/);
    assert.match(productionCsp, /connect-src[^;]*https:\/\/\*\.google-analytics\.com/);
    assert.match(productionCsp, /connect-src[^;]*https:\/\/\*\.analytics\.google\.com/);
    assert.match(productionCsp, /connect-src[^;]*https:\/\/\*\.googletagmanager\.com/);
    assert.match(productionCsp, /img-src[^;]*https:\/\/\*\.google-analytics\.com/);
    assert.match(productionCsp, /img-src[^;]*https:\/\/\*\.googletagmanager\.com/);
    assert.doesNotMatch(productionCsp, /unsafe-eval/);
    assert.match(developmentCsp, /unsafe-eval/);
  });
});
