import nodemailer from "nodemailer";

const IMAP_PORTS = new Set([143, 993, 995]);

function resolveSmtpHost(rawHost, user) {
  const host = rawHost?.trim();

  if (host) {
    const lower = host.toLowerCase();
    if (
      lower.startsWith("mail.") ||
      lower.startsWith("smtp.") ||
      lower.includes(".web-hosting.com")
    ) {
      return host;
    }

    // Bare domain (digimmatic.com) → cPanel convention
    return `mail.${host}`;
  }

  const domain = user?.split("@")[1];
  return domain ? `mail.${domain}` : null;
}

function resolveSmtpPort(rawPort) {
  const port = Number(rawPort);

  if (!port || IMAP_PORTS.has(port)) {
    return 465;
  }

  return port;
}

function resolveSecure(port, rawSecure) {
  if (rawSecure === "true") return true;
  if (rawSecure === "false") return false;
  return port === 465;
}

function getSmtpSettings() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const to = process.env.EMAIL_TO?.trim();

  if (!user || !pass || !to) {
    return null;
  }

  const port = resolveSmtpPort(process.env.SMTP_PORT);
  const host = resolveSmtpHost(process.env.SMTP_HOST, user);

  if (!host) {
    return null;
  }

  return {
    host,
    port,
    secure: resolveSecure(port, process.env.SMTP_SECURE),
    user,
    pass,
    from: process.env.SMTP_FROM?.trim() || user,
    to,
  };
}

function createTransporter(settings) {
  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: {
      user: settings.user,
      pass: settings.pass,
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    tls: {
      minVersion: "TLSv1.2",
      // Namecheap/cPanel presents *.web-hosting.com cert for mail.yourdomain.com
      rejectUnauthorized: false,
    },
  });
}

export function isSmtpConfigured() {
  return getSmtpSettings() !== null;
}

export async function sendDiscoveryInquiry({
  name,
  company,
  email,
  phone,
  solutions,
}) {
  const settings = getSmtpSettings();
  if (!settings) {
    throw new Error("SMTP environment variables are not configured.");
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

  const solutionList = solutions
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const subject = `[DIGIMMATIC AI] Discovery request — ${company} · ${name}`;
  const text = buildDiscoveryEmailText({
    name,
    company,
    email,
    phone,
    solutionList,
    submittedAt,
  });
  const html = buildDiscoveryEmailHtml({
    name,
    company,
    email,
    phone,
    solutionList,
    submittedAt,
  });

  const transporter = createTransporter(settings);

  try {
    await transporter.sendMail({
      from: settings.from,
      to: settings.to,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(`SMTP failed via ${settings.host}:${settings.port}`, {
      message: error.message,
      code: error.code,
      response: error.response,
    });
    throw error;
  }
}

function buildDiscoveryEmailText({
  name,
  company,
  email,
  phone,
  solutionList,
  submittedAt,
}) {
  return [
    "DIGIMMATIC AI — New Discovery Request",
    "",
    `Submitted: ${submittedAt} UTC`,
    "",
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Solutions: ${solutionList.join(", ")}`,
    "",
    `Reply directly to ${email} to continue the conversation.`,
  ].join("\n");
}

function buildDiscoveryEmailHtml({
  name,
  company,
  email,
  phone,
  solutionList,
  submittedAt,
}) {
  const solutionTags = solutionList
    .map(
      (solution) => `
        <span style="display:inline-block;margin:0 8px 8px 0;padding:6px 12px;border-radius:999px;background:rgba(173,198,255,0.12);border:1px solid rgba(173,198,255,0.28);color:#adc6ff;font-size:12px;font-weight:600;line-height:1;">
          ${escapeHtml(solution)}
        </span>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DIGIMMATIC AI Discovery Request</title>
  </head>
  <body style="margin:0;padding:0;background-color:#030712;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#030712;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#0a1020;border:1px solid rgba(173,198,255,0.18);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;background:linear-gradient(135deg,#10203f 0%,#0a1020 55%,#07101f 100%);border-bottom:1px solid rgba(173,198,255,0.12);">
                <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#94b3b8;margin-bottom:10px;">
                  DIGIMMATIC AI
                </div>
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;font-weight:800;">
                  New Discovery Request
                </h1>
                <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#cbd5e1;">
                  A prospect submitted the discovery form on <strong style="color:#ffffff;">digimmatic.com</strong>.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="padding:16px 18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;">
                      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#94b3b8;margin-bottom:6px;">
                        Contact
                      </div>
                      <div style="font-size:20px;font-weight:700;color:#ffffff;margin-bottom:4px;">
                        ${escapeHtml(name)}
                      </div>
                      <div style="font-size:14px;color:#cbd5e1;">
                        ${escapeHtml(company)}
                      </div>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:#14d1ff;text-decoration:none;">${escapeHtml(email)}</a>`)}
                  ${detailRow("Phone", escapeHtml(phone))}
                  ${detailRow("Submitted", `${escapeHtml(submittedAt)} UTC`)}
                </table>

                <div style="margin-top:28px;">
                  <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#94b3b8;margin-bottom:12px;">
                    AI Solutions Requested
                  </div>
                  <div>${solutionTags}</div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 28px;border-top:1px solid rgba(173,198,255,0.12);background:rgba(255,255,255,0.02);">
                <a href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: Discovery request — ${company}`)}"
                   style="display:inline-block;padding:12px 20px;border-radius:999px;background:linear-gradient(90deg,#adc6ff 0%,#14d1ff 100%);color:#002e6a;text-decoration:none;font-size:14px;font-weight:700;">
                  Reply to ${escapeHtml(name)}
                </a>
                <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#64748b;">
                  This message was generated automatically from the DIGIMMATIC AI contact form.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label, value) {
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td width="120" style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#94b3b8;vertical-align:top;">
              ${escapeHtml(label)}
            </td>
            <td style="font-size:15px;color:#f8fafc;vertical-align:top;">
              ${value}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
