import { NextRequest, NextResponse } from "next/server";
import { getQuoteFields, isContactPhone, needsWorksitePostcode, validateQuoteScope } from "@/lib/quote-requirements";

interface FileAttachment {
  filename: string;
  content: string; // base64
}

interface ContactFormData {
  reference: string;
  service: string;
  name: string;
  email: string;
  phone: string;
  plz: string;
  message: string;
  fileUrls: string[]; // Links from earlier versions of the form.
  fileAttachments: FileAttachment[];
  serviceDetails: Record<string, string>;
  businessInquiry: boolean;
  gclid?: string | null;
  quelle?: string;
  seite?: string;
}

const SERVICE_NAMES: Record<string, string> = {
  rueckruf: "Rückruf",
  lieferungen: "Lieferungen",
  moebelmontage: "Möbelmontage",
  kuechenmontage: "Küchenmontage",
  umzuege: "Umzüge",
  entruempelung: "Entrümpelung",
  andere: "Individuelle Anfrage",
};

// Get priority from service details
function getPriority(data: ContactFormData): string {
  const urgency = data.serviceDetails?.urgency || data.serviceDetails?.Dringlichkeit || "";
  if (urgency.toLowerCase().includes("dringend") || urgency.toLowerCase().includes("express")) {
    return "DRINGEND";
  }
  if (urgency.toLowerCase().includes("normal")) {
    return "Normal";
  }
  return data.serviceDetails.timeframe && data.serviceDetails.timeframe !== "Flexibel nach Vereinbarung" ? "Normal" : "Flexibel";
}

// Send to Google Sheets - Only essential columns (no phone).
// Returns true only when a request was actually accepted by the webhook.
async function sendToGoogleSheets(data: ContactFormData): Promise<boolean> {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return false;

  try {
    const priority = getPriority(data);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "form",
        name: data.name,
        email: data.email || "-",
        plz: data.plz || "-",
        service: (Object.hasOwn(SERVICE_NAMES, data.service) ? SERVICE_NAMES[data.service] : data.service),
        priority: priority,
        quelle: data.quelle || "Direct",
        gclid: data.gclid || "-",
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("Sheets error:", e);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function attachmentLink(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) {
      return escapeHtml(url.href);
    }
  } catch {
    // Invalid attachment addresses have no link in the email.
  }
}

function buildEmailHtml(data: ContactFormData): string {
  const service = escapeHtml((Object.hasOwn(SERVICE_NAMES, data.service) ? SERVICE_NAMES[data.service] : data.service));
  const section = (heading: string, content: string) => content ? `
    <section style="padding:18px 0;border-top:1px solid #CFD5C9">
      <h2 style="margin:0 0 12px;font-size:19px;line-height:1.25;color:#2D4731">${heading}</h2>
      ${content}
    </section>` : "";
  const row = (label: string, value: string) => `
    <tr>
      <th scope="row" style="width:42%;padding:6px 12px 6px 0;text-align:left;vertical-align:top;font-size:14px;font-weight:500;color:#435044">${escapeHtml(label)}</th>
      <td style="padding:6px 0;vertical-align:top;overflow-wrap:anywhere">${value}</td>
    </tr>`;
  const table = (rows: string) => rows ? `<table width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;border-collapse:collapse">${rows}</table>` : "";
  const groups = new Map<string, string[]>();
  const fields = data.service === "rueckruf"
    ? [{ key: "company", label: "Firma oder Organisation", group: "Rückrufwunsch" },
       { key: "timeSlot", label: "Erreichbar im Zeitfenster", group: "Rückrufwunsch" }]
    : getQuoteFields(data.service, data.serviceDetails, data.businessInquiry);
  for (const field of fields) {
    const value = data.serviceDetails[field.key] || (field.key === "specification" ? "Siehe beigefügte Datei(en)." : "");
    if (!value) continue;
    const rows = groups.get(field.group) || [];
    rows.push(row(field.label, escapeHtml(value).replace(/\r?\n/g, "<br>")));
    groups.set(field.group, rows);
  }
  const quoteSections = Array.from(groups, ([heading, rows]) => section(heading, table(rows.join("")))).join("");
  const phone = data.phone.replace(/[^\d+]/g, "");
  const dial = /^\+?\d{4,20}$/.test(phone) ? phone : "";
  const waPhone = dial.replace(/^00/, "+").replace(/^0/, "+49").replace(/^\+/, "");
  const linkStyle = "color:#792F24;text-decoration:underline;font-weight:650";
  const contactRows = [
    row("Name", escapeHtml(data.name)),
    row("Telefon", dial ? `<a href="tel:${dial}" style="${linkStyle}">${escapeHtml(data.phone)}</a>` : escapeHtml(data.phone)),
    data.email && row("E-Mail", `<a href="mailto:${escapeHtml(encodeURIComponent(data.email).replace("%40", "@"))}" style="${linkStyle}">${escapeHtml(data.email)}</a>`),
    data.plz && row("Ort / PLZ", escapeHtml(data.plz)),
  ].join("");
  const uploadLinks = data.fileUrls.map(attachmentLink).filter(Boolean).map((url, i) =>
    `<li style="margin:8px 0"><a href="${url}" style="${linkStyle}">Hochgeladene Datei ${i + 1} öffnen</a></li>`);
  const attachmentNames = (data.fileAttachments || []).map(file =>
    `<li style="margin:8px 0">${escapeHtml(file.filename)} (E-Mail-Anhang)</li>`);
  const files = [...uploadLinks, ...attachmentNames].join("");
  const requested = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

  return `<!doctype html>
<html lang="de" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Neue Anfrage · ${service}</title></head>
<body style="margin:0;background:#F7F5EF;color:#202A22;font:16px/1.5 Arial,sans-serif">
  <div lang="de" dir="ltr" style="max-width:580px;margin:0 auto;padding:18px;overflow-wrap:anywhere">
    <header style="padding:22px;background:#202A22;color:#F7F5EF;border-radius:16px">
      <p style="margin:0 0 12px;font-size:14px;color:#E4E9DE">Möbelmontage Nürnberg</p>
      <h1 style="margin:0;font-size:25px;line-height:1.2">${service} angefragt</h1>
      <p style="margin:8px 0 0;font-size:14px;color:#E4E9DE">${requested} Uhr · ${escapeHtml(data.reference)}${getPriority(data) === "DRINGEND" ? " · Express gewünscht" : ""}</p>
    </header>
    ${section("Kontakt", table(contactRows) + (dial ? `<p style="margin:14px 0 0"><a href="tel:${dial}" style="display:inline-block;margin:0 10px 8px 0;padding:10px 16px;border-radius:9px;background:#B72F20;color:#fff;text-decoration:none;font-weight:bold">Anrufen</a><a href="https://wa.me/${waPhone}" style="${linkStyle}">WhatsApp öffnen</a></p>` : ""))}
    ${quoteSections}
    ${section("Nachricht", data.message ? `<p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>` : "")}
    ${section("Dateien", files ? `<ul style="margin:0;padding-left:20px">${files}</ul>` : "")}
  </div>
</body></html>`;
}

// Remove non-ASCII characters for email fields
function toAscii(str: string): string {
  return str
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/[^\x20-\x7E]/g, '');
}

// Parse and sanitize the from email field
function getSafeFromEmail(): string {
  const fromEnv = process.env.RESEND_FROM_EMAIL || "";

  // Check if format is "Name <email>"
  const match = fromEnv.match(/<([^>]+)>/);
  if (match) {
    // Extract just the email
    const email = match[1];
    // Convert the name part to ASCII
    const namePart = fromEnv.replace(/<[^>]+>/, '').trim();
    const safeName = toAscii(namePart) || "Moebelmontage Nuernberg";
    return `${safeName} <${email}>`;
  }

  // If it's just an email, use default name
  if (fromEnv.includes('@')) {
    return `Moebelmontage Nuernberg <${fromEnv}>`;
  }

  // Fallback
  return "Moebelmontage Nuernberg <onboarding@resend.dev>";
}

// Try to extract a human-readable message from a Resend error response
function parseResendError(status: number, errorText: string): string {
  let message = errorText;
  try {
    const parsed = JSON.parse(errorText);
    message = parsed.message || parsed.error || errorText;
  } catch {
    // errorText is not JSON, use it as-is
  }

  const lower = message.toLowerCase();

  if (status === 401 || lower.includes("api key") || lower.includes("unauthorized")) {
    return "E-Mail-Versand fehlgeschlagen: Der Resend API-Schlüssel (RESEND_API_KEY) ist ungültig.";
  }
  if (status === 403 || lower.includes("domain is not verified") || lower.includes("not verified")) {
    return "E-Mail-Versand fehlgeschlagen: Die Absender-Domain ist bei Resend nicht verifiziert. Bitte Domain verifizieren oder RESEND_FROM_EMAIL auf onboarding@resend.dev setzen.";
  }
  if (lower.includes("from") && (lower.includes("invalid") || lower.includes("not allowed"))) {
    return `E-Mail-Versand fehlgeschlagen: Die Absender-Adresse (RESEND_FROM_EMAIL) ist ungültig. (${message})`;
  }
  if (status === 422) {
    return `E-Mail-Versand fehlgeschlagen: Ungültige Angaben. (${message})`;
  }
  if (status === 429) {
    return "E-Mail-Versand fehlgeschlagen: Zu viele Anfragen (Rate-Limit von Resend erreicht). Bitte kurz warten.";
  }

  return `E-Mail-Versand fehlgeschlagen (Resend ${status}): ${message}`;
}

// Send email - returns whether the email was ACTUALLY sent, plus a detailed reason on failure
async function sendEmail(data: ContactFormData): Promise<{ emailSent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.RECIPIENT_EMAIL;

  // Report exactly which piece of configuration is missing
  if (!apiKey && !recipientEmail) {
    return {
      emailSent: false,
      error: "E-Mail-Versand ist nicht konfiguriert: RESEND_API_KEY und RECIPIENT_EMAIL fehlen.",
    };
  }
  if (!apiKey) {
    return {
      emailSent: false,
      error: "E-Mail-Versand ist nicht konfiguriert: RESEND_API_KEY fehlt.",
    };
  }
  if (!recipientEmail) {
    return {
      emailSent: false,
      error: "E-Mail-Versand ist nicht konfiguriert: RECIPIENT_EMAIL (Empfänger) fehlt.",
    };
  }

  const serviceName = (Object.hasOwn(SERVICE_NAMES, data.service) ? SERVICE_NAMES[data.service] : data.service);
  const priority = getPriority(data);

  // Get sanitized from email
  const safeFrom = getSafeFromEmail();

  // Convert to ASCII for email headers
  const safeServiceName = toAscii(serviceName);
  const safeName = toAscii(data.name);

  try {
    // Prepare email payload
    const emailPayload: Record<string, unknown> = {
      from: safeFrom,
      to: [recipientEmail],
      subject: `${priority === "DRINGEND" ? "[DRINGEND] " : ""}${safeServiceName} - ${safeName} [${data.reference}]`,
      html: buildEmailHtml(data),
      reply_to: data.email || undefined,
    };

    // Add file attachments if present (PDFs, DOCs, etc.)
    if (data.fileAttachments && data.fileAttachments.length > 0) {
      console.log(`Adding ${data.fileAttachments.length} file attachments to email`);
      emailPayload.attachments = data.fileAttachments.map(att => ({
        filename: att.filename,
        content: att.content, // base64 content
      }));
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Email error:", res.status, errorText);
      return { emailSent: false, error: parseResendError(res.status, errorText) };
    }

    console.log("Email sent successfully");
    return { emailSent: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Email error:", message);
    return { emailSent: false, error: `Netzwerkfehler beim E-Mail-Versand: ${message}` };
  }
}

function isQuoteAttachment(file: FileAttachment): boolean {
  const header = Buffer.from(file.content.slice(0, 32), "base64");
  const hex = header.toString("hex");
  const ascii = header.toString("latin1");
  return hex.startsWith("ffd8ff") || hex.startsWith("89504e470d0a1a0a")
    || /^(GIF87a|GIF89a|RIFF[\s\S]{4}WEBP|%PDF-)/.test(ascii)
    || hex.startsWith("d0cf11e0a1b11ae1") || (hex.startsWith("504b0304") && /\.docx$/i.test(file.filename));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || [body.service, body.name, body.phone].some(value => typeof value !== "string" || !value.trim())) {
      return NextResponse.json(
        { success: false, error: "Pflichtfelder fehlen (Dienstleistung, Name und Telefon sind erforderlich)." },
        { status: 400 },
      );
    }

    const details: Record<string, string> = body.serviceDetails ?? {};
    const fileUrls = body.fileUrls || [];
    const attachments: FileAttachment[] = body.fileAttachments || [];
    const optionalFields = [body.email, body.plz, body.message, body.quelle, body.seite, body.gclid];
    if (optionalFields.some(value => value != null && typeof value !== "string")
      || typeof details !== "object" || Array.isArray(details)
      || (body.businessInquiry != null && typeof body.businessInquiry !== "boolean")
      || Object.values(details).some(value => typeof value !== "string")
      || !Array.isArray(fileUrls) || fileUrls.some(value => typeof value !== "string")
      || !Array.isArray(attachments) || attachments.some(file => !file || typeof file.filename !== "string" || typeof file.content !== "string")) {
      return NextResponse.json({ success: false, error: "Bitte prüfen Sie die Angaben und Anhänge." }, { status: 400 });
    }

    // Cached versions of the form used small image data URLs when storage was unavailable.
    const links: string[] = [];
    for (const url of fileUrls) {
      const inline = /^data:image\/(jpeg|png|webp|gif);base64,([a-z0-9+/=]+)$/i.exec(url);
      if (inline) {
        attachments.push({ filename: `Bild-${attachments.length + 1}.${inline[1].toLowerCase()}`, content: inline[2] });
      } else if (attachmentLink(url)) {
        links.push(url);
      } else if (url) {
        return NextResponse.json({ success: false, error: "Ein Dateilink ist ungültig. Bitte wählen Sie die Datei erneut." }, { status: 400 });
      }
    }

    const maxAttachmentBytes = 3 * 1024 * 1024;
    if (attachments.length + links.length > 8) {
      return NextResponse.json({ success: false, error: "Sie können bis zu fünf Fotos und drei Pläne mitsenden." }, { status: 400 });
    }
    let totalBytes = 0;
    for (const file of attachments) {
      if (!file.filename.trim() || !file.content || file.content.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(file.content)) {
        return NextResponse.json({ success: false, error: "Ein Anhang ist unvollständig. Bitte wählen Sie ihn erneut aus." }, { status: 400 });
      }
      totalBytes += Buffer.byteLength(file.content, "base64");
    }
    if (totalBytes > maxAttachmentBytes) {
      return NextResponse.json({ success: false, error: "Alle Anhänge zusammen dürfen nach der Vorbereitung höchstens 3 MB groß sein." }, { status: 413 });
    }
    if (!isContactPhone(body.phone)) return NextResponse.json({ success: false, field: "phone", error: "Bitte geben Sie eine erreichbare Telefonnummer mit Vorwahl an." }, { status: 400 });
    const email = body.email?.trim() || "";
    if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return NextResponse.json({ success: false, field: "email", error: "Bitte die E-Mail-Adresse prüfen." }, { status: 400 });
    const businessInquiry = body.businessInquiry === true;
    const service = body.service.trim();
    const serviceDetails = Object.fromEntries(Object.entries(details).map(([key, value]) => [key, value.trim()]));
    let plz = body.plz?.trim() || "";
    if (service !== "rueckruf") {
      const issue = validateQuoteScope({ service, plz, serviceDetails, fileCount: attachments.filter(isQuoteAttachment).length, businessInquiry });
      if (issue) return NextResponse.json({ success: false, field: issue.field, error: issue.message }, { status: 400 });
      if (!needsWorksitePostcode(service)) plz = serviceDetails.deliveryAddress?.match(/\b\d{5}\b/)?.[0] || "";
    }
    const data: ContactFormData = {
      reference: `MN-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`,
      service,
      name: body.name.trim(),
      email,
      phone: body.phone.trim(),
      plz,
      message: body.message || "",
      fileUrls: links,
      fileAttachments: attachments,
      serviceDetails,
      businessInquiry,
      gclid: body.gclid,
      quelle: body.quelle,
      seite: body.seite,
    };

    // Secondary notification (best effort): Google Sheets. Never blocks the result.
    let sheetsSuccess = false;
    try {
      sheetsSuccess = await sendToGoogleSheets(data);
      if (sheetsSuccess) console.log("Google Sheets notification sent successfully");
    } catch (sheetsError) {
      console.error("Google Sheets error:", sheetsError);
    }

    // Primary notification: the e-mail to the business. This MUST succeed.
    const emailResult = await sendEmail(data);

    // If the e-mail did not actually go out, tell the client exactly why so it
    // can be shown on the site. Do NOT pretend the submission succeeded.
    if (!emailResult.emailSent) {
      console.error("Contact form NOT delivered - email failed:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error:
            emailResult.error ||
            "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
          notificationsSent: { sheets: sheetsSuccess, email: false },
        },
        { status: 502 },
      );
    }

    console.log("Contact form delivered successfully via email");
    return NextResponse.json({
      success: true,
      reference: data.reference,
      imagesReceived: data.fileUrls.length,
      attachmentsReceived: data.fileAttachments?.length || 0,
      notificationsSent: {
        sheets: sheetsSuccess,
        email: emailResult.emailSent,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("API error:", message);
    return NextResponse.json(
      { success: false, error: `Serverfehler: ${message}` },
      { status: 500 },
    );
  }
}
