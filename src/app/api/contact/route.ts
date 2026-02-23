import { NextRequest, NextResponse } from "next/server";

// Types
interface ContactFormData {
  service: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  fileUrls: string[]; // Changed from images to fileUrls
}

// Send data to Google Sheets via webhook (WITHOUT files)
async function sendToGoogleSheets(formData: ContactFormData): Promise<boolean> {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("Google Sheets webhook URL not configured, skipping");
    return false;
  }

  try {
    const serviceNames: Record<string, string> = {
      lieferungen: "Lieferungen",
      moebelmontage: "Möbelmontage",
      kuechenmontage: "Küchenmontage",
      andere: "Andere",
    };

    const payload = {
      timestamp: new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" }),
      service: serviceNames[formData.service] || formData.service,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || "-",
      city: formData.city,
      message: formData.message,
      fileCount: formData.fileUrls?.length || 0,
    };

    console.log("Sending to Google Sheets:", JSON.stringify(payload));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("Data sent to Google Sheets successfully");
      return true;
    } else {
      console.error("Google Sheets webhook error:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Google Sheets webhook error:", error);
    return false;
  }
}

// Build file links HTML for email
function buildFileLinksHtml(fileUrls: string[]): string {
  if (!fileUrls || fileUrls.length === 0) return "";

  const fileLinks = fileUrls.map((url, index) => {
    // Extract filename from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    // Get file extension
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    // Determine file type icon
    let icon = '📎';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) icon = '🖼️';
    else if (ext === 'pdf') icon = '📄';
    else if (['doc', 'docx'].includes(ext)) icon = '📝';
    else if (['xls', 'xlsx'].includes(ext)) icon = '📊';

    return `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="margin-right: 8px;">${icon}</span>
          <a href="${url}" target="_blank" style="color: #f97316; text-decoration: none; font-weight: 500;">
            Datei ${index + 1} herunterladen
          </a>
          <span style="color: #9ca3af; font-size: 12px; margin-left: 8px;">(${ext.toUpperCase()})</span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div style="margin-top: 20px;">
      <h3 style="color: #333; margin-bottom: 10px;">📎 Angehängte Dateien (${fileUrls.length}):</h3>
      <table style="width: 100%; background-color: #f0fdf4; border-radius: 8px; border-collapse: collapse;">
        ${fileLinks}
      </table>
      <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
        Klicken Sie auf die Links, um die Dateien herunterzuladen. Die Dateien sind 30 Tage verfügbar.
      </p>
    </div>
  `;
}

// Send email notification via Resend
async function sendEmailNotification(
  formData: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.RECIPIENT_EMAIL;

  console.log("=== Contact Form Submission ===");
  console.log("API Key exists:", !!apiKey);
  console.log("Recipient Email:", recipientEmail);
  console.log("Service:", formData.service);
  console.log("Name:", formData.name);
  console.log("Phone:", formData.phone);
  console.log("City:", formData.city);
  console.log("Files count:", formData.fileUrls?.length || 0);

  if (!apiKey) {
    console.error("ERROR: RESEND_API_KEY is not configured");
    return { success: false, error: "E-Mail-Konfiguration fehlt. Bitte kontaktieren Sie uns telefonisch." };
  }

  if (!recipientEmail) {
    console.error("ERROR: RECIPIENT_EMAIL is not configured");
    return { success: false, error: "E-Mail-Konfiguration fehlt. Bitte kontaktieren Sie uns telefonisch." };
  }

  try {
    const serviceNames: Record<string, string> = {
      lieferungen: "Lieferungen",
      moebelmontage: "Möbelmontage",
      kuechenmontage: "Küchenmontage",
      andere: "Andere",
    };

    const serviceName = serviceNames[formData.service] || formData.service;
    console.log("Service name resolved:", serviceName);

    // Build file links HTML
    const fileLinksHtml = buildFileLinksHtml(formData.fileUrls || []);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Neue Anfrage - Möbelmontage Nürnberg</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #f97316; margin: 0;">Neue Anfrage</h1>
              <p style="color: #666; margin-top: 10px;">Möbelmontage Nürnberg</p>
            </div>

            <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ea580c; margin-top: 0; font-size: 18px;">Dienstleistung: ${serviceName}</h2>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;">Name:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">${formData.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Telefon:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">
                  <a href="tel:${formData.phone}" style="color: #f97316; text-decoration: none;">${formData.phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">E-Mail:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                  ${formData.email ? `<a href="mailto:${formData.email}" style="color: #f97316; text-decoration: none;">${formData.email}</a>` : "-"}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Stadt/PLZ:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${formData.city}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Nachricht:</h3>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
                ${formData.message}
              </div>
            </div>

            ${fileLinksHtml}

            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
              <p>Diese E-Mail wurde automatisch generiert von mobelmontage-nurnberg.de</p>
              <p>Datum: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log("Sending email to Resend API...");

    // Use customer name and service in the from field for better identification
    const fromDomain = process.env.RESEND_FROM_EMAIL || "info@mobelmontage-nurnberg.de";
    // Extract just the email if it's in "Name <email>" format
    const emailOnly = fromDomain.match(/<(.+)>/)?.[1] || fromDomain;
    // Use customer name and service type in sender
    const fromEmail = `${formData.name} - ${serviceName} <${emailOnly}>`;

    const emailPayload: Record<string, unknown> = {
      from: fromEmail,
      to: [recipientEmail],
      subject: `Neue Anfrage: ${serviceName} - ${formData.name}${formData.fileUrls?.length ? ` (${formData.fileUrls.length} Dateien)` : ''}`,
      html: emailHtml,
    };

    // Add reply_to if email provided
    if (formData.email) {
      emailPayload.reply_to = formData.email;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await response.json();
    console.log("Resend API response status:", response.status);
    console.log("Resend API response:", JSON.stringify(responseData));

    if (!response.ok) {
      console.error("Resend error:", responseData);

      // More specific error messages
      const errorMsg = responseData.message || "";
      if (errorMsg.includes("domain") || errorMsg.includes("not verified")) {
        return { success: false, error: "E-Mail-Domain nicht verifiziert. Bitte kontaktieren Sie uns telefonisch." };
      }
      if (errorMsg.includes("API key") || errorMsg.includes("unauthorized")) {
        return { success: false, error: "API-Konfigurationsfehler. Bitte kontaktieren Sie uns telefonisch." };
      }
      if (errorMsg.includes("rate") || errorMsg.includes("limit")) {
        return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut." };
      }

      return { success: false, error: "E-Mail konnte nicht gesendet werden. Bitte kontaktieren Sie uns telefonisch." };
    }

    console.log("Email sent successfully! ID:", responseData.id);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: "Netzwerkfehler beim Senden. Bitte versuchen Sie es später erneut." };
  }
}

export async function POST(request: NextRequest) {
  console.log("=== POST /api/contact ===");

  try {
    // Check content length
    const contentLength = request.headers.get("content-length");
    console.log("Request content length:", contentLength);

    const body: ContactFormData = await request.json();

    console.log("Received form data:", {
      service: body.service,
      name: body.name,
      phone: body.phone,
      city: body.city,
      messageLength: body.message?.length || 0,
      filesCount: body.fileUrls?.length || 0,
    });

    // Validate required fields
    if (!body.service) {
      console.error("Missing service field");
      return NextResponse.json(
        { error: "Bitte wählen Sie eine Dienstleistung aus." },
        { status: 400 }
      );
    }

    if (!body.name) {
      console.error("Missing name field");
      return NextResponse.json(
        { error: "Bitte geben Sie Ihren Namen ein." },
        { status: 400 }
      );
    }

    if (!body.phone) {
      console.error("Missing phone field");
      return NextResponse.json(
        { error: "Bitte geben Sie Ihre Telefonnummer ein." },
        { status: 400 }
      );
    }

    if (!body.city) {
      console.error("Missing city field");
      return NextResponse.json(
        { error: "Bitte geben Sie Ihre Stadt/PLZ ein." },
        { status: 400 }
      );
    }

    if (!body.message) {
      console.error("Missing message field");
      return NextResponse.json(
        { error: "Bitte beschreiben Sie Ihr Projekt." },
        { status: 400 }
      );
    }

    // Send to Google Sheets first (don't fail if this fails)
    await sendToGoogleSheets(body);

    // Send email
    const emailResult = await sendEmailNotification(body);

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      return NextResponse.json(
        { error: emailResult.error },
        { status: 500 }
      );
    }

    console.log("=== Request completed successfully ===");

    return NextResponse.json({
      success: true,
      message: "Anfrage erfolgreich gesendet!",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    // Check for specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Ungültige Anfrage. Bitte versuchen Sie es erneut." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
