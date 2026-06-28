/**
 * Local SMTP test — run with:
 *   node --env-file=.env.local scripts/test-smtp.mjs
 *
 * Tries common cPanel configs until one succeeds.
 */
import nodemailer from "nodemailer";

const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASS?.trim();
const to = process.env.EMAIL_TO?.trim() || user;
const domain = user?.split("@")[1];

if (!user || !pass) {
  console.error("Missing SMTP_USER or SMTP_PASS. Create .env.local first.");
  process.exit(1);
}

function resolveSecure(port, rawSecure) {
  if (rawSecure === "true") return true;
  if (rawSecure === "false") return false;
  return port === 465;
}

const envPort = Number(process.env.SMTP_PORT) || 465;

const configs = [
  {
    label: "env (as configured)",
    host: process.env.SMTP_HOST?.trim(),
    port: envPort,
    secure: resolveSecure(envPort, process.env.SMTP_SECURE),
  },
  {
    label: "cPanel SSL 465",
    host: `mail.${domain}`,
    port: 465,
    secure: true,
  },
  {
    label: "cPanel STARTTLS 587",
    host: `mail.${domain}`,
    port: 587,
    secure: false,
  },
];

const seen = new Set();

for (const cfg of configs) {
  const host =
    cfg.host ||
    (domain?.startsWith("mail.") ? domain : domain ? `mail.${domain}` : null);
  if (!host) continue;

  const key = `${host}:${cfg.port}:${cfg.secure}`;
  if (seen.has(key)) continue;
  seen.add(key);

  console.log(`\n→ Trying ${cfg.label}: ${host}:${cfg.port} secure=${cfg.secure}`);

  const transporter = nodemailer.createTransport({
    host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    tls: {
      minVersion: "TLSv1.2",
      // Namecheap/cPanel often presents a *.web-hosting.com cert for mail.domain.com
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    console.log("  ✓ Connection + auth OK");

    const info = await transporter.sendMail({
      from: user,
      to,
      subject: `SMTP test ${new Date().toISOString()}`,
      text: "If you received this, SMTP is working.",
    });

    console.log("  ✓ Email sent:", info.messageId);
    console.log("\nSUCCESS — use these Netlify values:");
    console.log(`  SMTP_HOST=${host}`);
    console.log(`  SMTP_PORT=${cfg.port}`);
    console.log(`  SMTP_SECURE=${cfg.secure}`);
    console.log(`  SMTP_USER=${user}`);
    console.log(`  EMAIL_TO=${to}`);
    process.exit(0);
  } catch (error) {
    console.error("  ✗ Failed:", error.code || "", error.message);
    if (error.response) console.error("    ", error.response);
  }
}

console.error("\nAll configurations failed.");
process.exit(1);
