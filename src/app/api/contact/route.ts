import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { buildOperatorEmail, legacyAttachmentUrl } from "@/lib/operator-email";
import { isContactPhone, needsWorksitePostcode, validateQuoteScope } from "@/lib/quote-requirements";
import { sendSheetNotification } from "@/lib/sheet-notification";

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
  return sendSheetNotification({
    reference: data.reference,
    eventType: "form",
    name: data.name,
    email: data.email || "-",
    plz: data.plz || "-",
    service: Object.hasOwn(SERVICE_NAMES, data.service) ? SERVICE_NAMES[data.service] : data.service,
    priority: getPriority(data),
    quelle: data.quelle || "Direct",
    gclid: data.gclid || "-",
  });
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
async function sendEmail(data: ContactFormData, key: string, submittedAt?: Date): Promise<{ emailSent: boolean; error?: string }> {
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
      ...buildOperatorEmail(data, { serviceName, express: priority === "DRINGEND", submittedAt }),
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
        "Idempotency-Key": "montage/" + key,
      },
      body: JSON.stringify(emailPayload),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Email error:", res.status, errorText);
      return { emailSent: false, error: parseResendError(res.status, errorText) };
    }

    const receipt = await res.json();
    return typeof receipt?.id === "string" && receipt.id
      ? { emailSent: true }
      : { emailSent: false, error: "Mail provider returned no receipt ID." };
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
      } else if (legacyAttachmentUrl(url)) {
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
      reference: "",
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

    // Existing clients omit the token. New forms retain it across a failed submission.
    const attempt = typeof body.attempt === "string" && /^(\d{13})\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(body.attempt);
    const key = createHash("sha256").update(JSON.stringify([
      attempt ? body.attempt : crypto.randomUUID(),
      service, data.name, data.phone, email, plz, data.message, data.serviceDetails, businessInquiry, links, attachments,
    ])).digest("hex");
    data.reference = `MN-${key.slice(0, 12).toUpperCase()}`;
    const emailResult = await sendEmail(data, key, attempt ? new Date(Number(attempt[1])) : undefined);
    if (!emailResult.emailSent) {
      console.error("Contact form NOT delivered - email failed:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: "Ihre Anfrage konnte nicht bestätigt werden. Ihre Angaben bleiben im Formular. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
          notificationsSent: { sheets: false, email: false },
        },
        { status: 502 },
      );
    }

    // Record only enquiries already accepted by the business's email provider.
    const sheetsSuccess = await sendToGoogleSheets(data);
    if (!sheetsSuccess) console.warn("Sheet notification unconfirmed for", data.reference);
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
      { success: false, error: "Ihre Anfrage konnte nicht bestätigt werden. Bitte versuchen Sie es erneut oder rufen Sie uns an." },
      { status: 500 },
    );
  }
}
