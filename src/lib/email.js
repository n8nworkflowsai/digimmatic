import { Resend } from "resend";

function getMissingEmailEnvVars() {
  const missing = [];

  if (!process.env.RESEND_API_KEY?.trim()) {
    missing.push("RESEND_API_KEY");
  }
  if (!process.env.EMAIL_TO?.trim()) {
    missing.push("EMAIL_TO");
  }
  if (!process.env.EMAIL_FROM?.trim()) {
    missing.push("EMAIL_FROM");
  }

  return missing;
}

function logEmailConfigError(missing) {
  console.error("[email] Resend is not configured.", {
    missing,
    hint: "Set RESEND_API_KEY, EMAIL_TO, and EMAIL_FROM in .env.local or your deployment environment.",
  });

  if (missing.includes("RESEND_API_KEY")) {
    console.error(
      "[email] RESEND_API_KEY is missing. Get a key at https://resend.com/api-keys",
    );
  }
}

function getEmailSettings() {
  const missing = getMissingEmailEnvVars();
  if (missing.length > 0) {
    return null;
  }

  return {
    apiKey: process.env.RESEND_API_KEY.trim(),
    to: process.env.EMAIL_TO.trim(),
    from: process.env.EMAIL_FROM.trim(),
  };
}

export function isEmailConfigured() {
  return getEmailSettings() !== null;
}

export async function sendDiscoveryInquiry({
  name,
  company,
  email,
  phone,
  solutions,
}) {
  const settings = getEmailSettings();
  if (!settings) {
    const missing = getMissingEmailEnvVars();
    logEmailConfigError(missing);
    throw new Error(
      `Resend is not configured. Missing: ${missing.join(", ")}`,
    );
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

  const resend = new Resend(settings.apiKey);

  const { data, error } = await resend.emails.send({
    from: settings.from,
    to: settings.to,
    replyTo: email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[email] Resend send failed:", {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode,
      to: settings.to,
      from: settings.from,
    });
    throw new Error(error.message);
  }

  return data;
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
                <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Re: Discovery request — ${company}`)}"
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
